"""Build the original castle using Blender 4.3. Run with blender -b -t 4 -P Burg-bauen.py."""
import bpy
import math
import random
from collections import defaultdict
from pathlib import Path
from mathutils import Vector

ROOT = Path(__file__).resolve().parent
rng = random.Random(484)
bpy.ops.object.select_all(action='SELECT')
bpy.ops.object.delete(use_global=False)
groups = defaultdict(lambda: ([], []))

def mesh(label, color, vertices, faces):
    points, polygons = groups[label, color]
    start = len(points)
    points.extend(vertices)
    polygons.extend(tuple(start+i for i in face) for face in faces)

def box(label, color, x, y, z, w, h, d):
    # Coordinates match the game (X right, Y up, Z depth).
    v = [(x+i*w/2,y+j*h/2,z+k*d/2) for i,j,k in
         [(-1,-1,-1),(1,-1,-1),(1,1,-1),(-1,1,-1),
          (-1,-1,1),(1,-1,1),(1,1,1),(-1,1,1)]]
    mesh(label,color,v,[(0,3,2,1),(4,5,6,7),(0,1,5,4),
                        (3,7,6,2),(0,4,7,3),(1,2,6,5)])

stone = (0xc1b39a,0xc9bca5,0xcdbfa8,0xb5aa94,0xd5c7af,0xbfb39d)
trim = 0xe0d3b7
red = (0xa35d48,0x9b5442,0xac6149,0xb26a51,0x95513d)
slate = (0x303e4b,0x3a4a58,0x465361,0x354451)
oak, metal, gold, blue = 0x654732,0x292d30,0xc79a50,0x25496e

def rings(label, palette, x, z, levels, n=16, phase=0):
    for (low, a),(high,b) in zip(levels,levels[1:]):
        for i in range(n):
            t = phase+i*math.tau/n
            u = phase+(i+1)*math.tau/n
            v = [(x+r*math.cos(q),y,z+r*math.sin(q))
                 for y,r,q in [(low,a,t),(high,b,t),(high,b,u),(low,a,u)]]
            mesh(label,rng.choice(palette),v,[(0,1,2,3)])

def wall(label, palette, center, plane, width, bottom, height, depth, openings=(), side=False):
    # Courses split at the openings so the tor and hall really are hollow.
    rows = math.ceil(height/.42)
    for row in range(rows):
        low = bottom+row*height/rows
        high = bottom+(row+1)*height/rows
        segments = [(center-width/2,center+width/2)]
        for lo,hi,yl,yh in openings:
            if high<=yl+1e-4 or low>=yh-1e-4:
                continue
            split = []
            for a,b in segments:
                if hi<=a or lo>=b:
                    split.append((a,b))
                else:
                    if a<lo: split.append((a,lo))
                    if hi<b: split.append((hi,b))
            segments = split
        for a,b in segments:
            step=.89
            boundaries=[a]+[center+(i+(row%2)*.5)*step
                           for i in range(-80,81) if a+.09<center+(i+(row%2)*.5)*step<b-.09]+[b]
            for left,right in zip(boundaries,boundaries[1:]):
                pos=(left+right)/2
                x,z=(plane,pos) if side else (pos,plane)
                span=right-left-.018
                thick=depth+rng.uniform(-.012,.025)
                box(label,rng.choice(palette),x,(low+high)/2,z,
                    thick if side else span,high-low-.014,span if side else thick)

def window(x,y,z,width=.92,height=1.78, back=False):
    direction=1 if back else -1
    box('Fensterrahmen',trim,x,y,z,width+.23,height+.18,.14)
    box('Fenster',0x293e4c,x,y+.025,z+.09*direction,width,height-.12,.07)
    box('Sohlbank',trim,x,y-height/2,z+.095*direction,width+.3,.15,.32)
    box('Sprossen',0x9b8c72,x,y,z+.15*direction,.045,height-.13,.025)
    box('Sprossen',0x9b8c72,x,y+.29,z+.15*direction,width,.046,.025)

def roof(label,x,y,z,w,d,h,hip=.75):
    x0,x1=x-w/2,x+w/2
    z0,z1=z-d/2,z+d/2
    v=[(x0,y,z0),(x1,y,z0),(x1,y,z1),(x0,y,z1),
       (x0+hip,y+h,z),(x1-hip,y+h,z)]
    for i,face in enumerate([(0,4,5,1),(2,5,4,3),(3,4,0),(1,5,2),(3,0,1,2)]):
        mesh(label,slate[i%4],v,[face[::-1]])
    # Ribs follow both roof slopes, with dark overlap lines between courses.
    for n in range(1,12):
        t=n/12
        for direction in (-1,1):
            box('Schieferkurse',slate[n%4],x,y+h*t+.025,z+direction*d/2*(1-t),
                w-2*hip*t,.065,.07)
    box('First',0x59636a,x,y+h+.08,z,w-2*hip+.24,.14,.21)

def tower(x,z,r,h,spire):
    rings('Turmmauer',stone,x,z,[(0,r+.22),(.36,r+.22),(.65,r)]+
          [(.65+(h-.65)*i/36,r) for i in range(1,37)],16)
    for y in (1.08,h*.45,h*.76,h-.48,h):
        rings('Turmgesims',(trim,),x,z,[(y-.13,r-.02),(y-.045,r+.16),
                                      (y+.10,r+.16),(y+.17,r-.015)])
    for y in (h*.34,h*.58,h*.84):
        window(x,y,z-r-.035,r*.46,1.6)
    rings('Turmhelm',slate,x,z,[(h+.08,r+.28),(h+.34,r+.26)]+
          [(h+.34+spire*i/18,max(.052,(r+.26)*(1-i/18)**1.32))
           for i in range(1,19)])
    peak=h+spire+.34
    rings('Spitzen',(gold,),x,z,[(peak-.07,.075),(peak+.43,.057),
                                 (peak+.51,.14),(peak+.65,.14),(peak+.76,.018)],10)

def arch(x,z,y,r,width,depth):
    for i in range(15):
        a=(i+.035)*math.pi/15
        b=(i+.965)*math.pi/15
        cross=[(x+rad*math.cos(t),y+rad*math.sin(t))
               for rad,t in [(r,a),(r+width,a),(r+width,b),(r,b)]]
        v=[(u,v,z+offset) for offset in (-depth/2,depth/2) for u,v in cross]
        mesh('Torbogen',stone[(i+2)%len(stone)],v,
             [(0,3,2,1),(4,5,6,7),(0,1,5,4),(1,2,6,5),(2,3,7,6),(3,0,4,7)])

def banner(x,y,z,width,height):
    points=[]
    for v in range(17):
        t=v/16
        for u in range(15):
            k=u/14
            points.append((x+(k-.5)*width,
                           y-t*height-(1-abs(k-.5)*2)*.26*t**7,
                           z-.065*math.sin(k*math.pi*5)-.035*t*math.cos(k*13+t*3)))
    for v in range(16):
        for u in range(14):
            i=v*15+u
            color=gold if u in (0,13) or (abs(u-6.5)+abs(v-6)<4) else blue
            mesh('Burgbanner',color,points,[ (i,i+1,i+16,i+15) ])
    box('Bannerstangen',oak,x,y+.065,z,width+.34,.09,.09)

# Front gate and two flanking round towers. The gate threshold is Z=0.
for x in (-8,8):
    wall('Torhaus Ziegel',red,x,.38,10.6,0,9.5,.76)
    for y in (.42,4.2,7.6,9.49):
        box('Torhaus Gesims',trim,x,y,-.074,10.65,.16,.48)
    window(x,6.15,-.07)
    banner(x,5.15,-.55,1.14,3.4)
wall('Torhaus Ziegel',red,0,.38,5.4,4.55,4.95,.76)
for x in (-2.25,2.25):
    box('Torpfosten',trim,x,1.3,-.06,.53,2.6,.96)
for i in range(15):
    # Fill the wall above the voussoirs up to the continuous masonry.
    a=i*math.pi/15
    b=(i+1)*math.pi/15
    r=2.51
    p=[(r*math.cos(t),2.55+r*math.sin(t)) for t in (a,b)]
    vertices=[(x,y,z) for z in (0,.75) for x,y in
              [p[0],p[1],(p[1][0],5.18),(p[0][0],5.18)]]
    mesh('Torhaus Ziegel',red[i%len(red)],vertices,
         [(0,1,2,3),(7,6,5,4),(0,4,5,1),(1,5,6,2),(2,6,7,3),(3,7,4,0)])
arch(0,-.08,2.55,1.98,.56,.59)
for x in (-2.55,2.55):
    box('Tortunnel',trim,x,2.25,1.65,.70,4.5,3.4)
box('Tortunnel',trim,0,5.15,1.75,5.7,.38,3.5)
for x in (-12.8,12.8):
    tower(x,1.85,2.45,12.5,6.2)
for x in (-8,0,8):
    for delta in (-2.4,-1.2,0,1.2,2.4):
        box('Torzinnen',trim,x+delta,9.86,.26,.63,.87,1.05)

for x in (-14.1,14.1):
    wall('Ringmauer',stone,13,x,24,0,5.15,.65,side=True)
    box('Ringmauer Gesims',trim,x,5.17,13,.93,.21,24.45)
    for z in range(4,25,2):
        box('Ringmauer Zinnen',trim,x,5.64,z,.86,.77,.92)
    tower(x,24,2.05,10.8,5)
wall('Rueckmauer',stone,0,30,32,0,8.2,.75)

# Main palace around an open, furnished hall.
for x in (-4.9,4.9):
    wall('Halle Kalkstein',stone,x,18.4,8.7,0,13.1,.68)
for x in (-9.1,9.1):
    wall('Halle Kalkstein',stone,23.6,x,10.9,0,13.1,.68,side=True)
wall('Halle Kalkstein',stone,0,29.05,18.6,0,13.1,.68)
wall('Halle Portalaufsatz',stone,0,18.4,3.25,3.9,9.2,.68)
for x in (-1.45,1.45):
    box('Hallenportal',trim,x,1.25,17.96,.27,2.5,.48)
arch(0,17.98,2.14,1.3,.25,.38)
roof('Palas Schiefer',0,13.2,23.75,19.8,12.4,4.9,1.6)
for y in (4.35,7.5,10.62,13.04):
    box('Palas Gesims',trim,0,y,18,18.6,.18,.39)
for x in (-7.5,-5.07,-2.68,0,2.68,5.07,7.5):
    for y in (2.6,5.96,9.05,11.8):
        if x or y>4: window(x,y,17.96,.96,1.75)
for x in (-5.9,5.9):
    banner(x,8.1,17.61,1.28,4.18)
for x,z,r,h,s in [(-7.1,22.3,2.2,19.1,8.7),(6.4,24.6,2,20.8,9.7),
                  (2.1,28.1,1.6,21.8,11.7),(-9.35,17.7,1.25,15.6,5.4),
                  (9.35,17.7,1.25,15.2,5.8)]:
    tower(x,z,r,h,s)
# Square campanile, paired louvers and overhanging slate cap.
wall('Bergfried',stone,11.05,23.55,4.15,0,22,.55)
wall('Bergfried',stone,11.05,27.7,4.15,0,22,.55)
for x in (9,13.1):
    wall('Bergfried',stone,25.62,x,4.35,0,22,.55,side=True)
for y in (8.4,13.1,17.1,20.4):
    for x in (10.35,11.75): window(x,y,23.22,.73,1.64)
for y in (17.95,21.25,22):
    box('Bergfried Fries',trim,11.05,y,25.61,4.62,.25,4.96)
roof('Bergfried Dach',11.05,22.15,25.61,5.18,5.48,3.4,1.65)

# Courtyard paving, carved well, long tables and benches.
for row in range(39):
    for i in range(38):
        x=(i-18.5)*.73+(.15 if row%2 else 0)
        z=.36+row*.76
        palette=stone if abs(x)<2.5 or 8<z<10 else (0x807f70,0x93917f,0x9c9685,0x898574)
        box('Hofpflaster',rng.choice(palette),x,-.035,z,.713,.08,.744)
for i in range(10):
    for j in range(6):
        box('Saalboden',rng.choice((oak,0x775139,0x6d4d38)),(i-4.5)*1.7,.015,19.26+j*1.58,
            1.68,.05,1.56)
rings('Brunnen',(trim,0xb9ab91),7,9,[(0,1.5),(.15,1.52),(.27,1.35),
                                    (1.05,1.34),(1.13,1.47),(1.27,1.47),
                                    (1.27,1.13),(.3,1.13)])
for x in (5.95,8.05):
    box('Brunnen Eiche',oak,x,1.5,9,.19,2.9,.19)
roof('Brunnendach',7,2.85,9,3.05,2.95,.86,.55)
for x,z in [(-6.6,8.5),(-6.6,12),(6.6,13),(-5,23),(5,23),(0,26.7)]:
    box('Mobiliar',oak,x,.78,z,2.45,.17,.85)
    for a in (-.95,.95):
        box('Mobiliar',oak,x+a,.37,z,.19,.73,.69)
    for offset in (-.73,.73):
        box('Mobiliar',0x7b533c,x,.43,z+offset,2.45,.16,.28)
        for a in (-.86,.86): box('Mobiliar',oak,x+a,.19,z+offset,.20,.39,.23)
for x,z in [(-2.95,-.38),(2.95,-.38),(-2.15,17.92),(2.15,17.92),
            (-8.63,22.4),(8.63,22.4),(-8.63,25),(8.63,25)]:
    box('Laternen',metal,x,2.42,z,.30,.09,.30)
    box('Laternenglas',0xffb456,x,2.64,z,.21,.37,.21)
    box('Laternen',metal,x,2.88,z,.32,.085,.32)

# Sculpted low stone terraces out to the sides, leaving the entrance level.
for side in (-1,1):
    for i in range(60):
        z=rng.uniform(-.6,31)
        x=side*rng.uniform(15.8,20.5)
        h=rng.uniform(.25,1.2)*(1-(abs(x)-15.8)/8)
        box('Felsfundament',rng.choice((0x827c74,0x938b7e,0xa19a8d)),x,h/2-.16,z,
            rng.uniform(.8,2.8),h,rng.uniform(.8,3.0))

# Hall ceiling carpentry and suspended lanterns.
for z in (19.7,22.2,24.7,27.2):
    box('Saalbalken',oak,0,6.75,z,18.2,.32,.38)
    for x in (-4.5,4.5):
        box('Laternenkette',metal,x,5.35,z,.04,2.65,.04)
        box('Laternen',metal,x,3.94,z,.35,.12,.35)
        box('Laternenglas',0xffb456,x,4.16,z,.24,.37,.24)
        box('Laternen',metal,x,4.37,z,.35,.105,.35)

# Pine groups frame the view without narrowing the main approach.
for side in (-1,1):
    for x,z,h in [(23,-3,7.2),(25,3,9),(21,13,6.8),(22,20,8.5),
                  (18,31,10),(23,34,9),(27,27,7),(27,-7,6),(29,12,9)]:
        x*=side
        z+=rng.uniform(-1.2,1.2)
        h*=rng.uniform(.82,1.16)
        box('Fichtenstamm',0x513c29,x,h*.34,z,.41,h*.7,.40)
        for layer in range(5):
            y=h*(.28+layer*.125)
            r=h*(.246-layer*.041)
            rings('Fichten',(0x283e30,0x344c35,0x3b5539,0x456047),
                  x,z,[(y+.13,r*.58),(y,r),(y+h*.255,.075)],8,math.pi/8)
for side in (-1,1):
    for i in range(31):
        z=-.86-i*.79
        x=side*1.97
        box('Wegeinfassung',rng.choice(stone),x,.025,z,.18,.07,.766)
    for x,z in [(6,-9),(8,-16),(6,-25),(22,-15)]:
        box('Wegrand Findlinge',rng.choice(stone),side*x,.17,z,.7,.35,.6)

def linear(value):
    value/=255
    return value/12.92 if value<=.04045 else ((value+.055)/1.055)**2.4

for (label,color),(vertices,faces) in groups.items():
    data=bpy.data.meshes.new(label)
    data.from_pydata([(x,-z,y) for x,y,z in vertices],[],faces)
    data.update()
    obj=bpy.data.objects.new(label,data)
    bpy.context.collection.objects.link(obj)
    material=bpy.data.materials.new(f'{label} · {color:06x}')
    material.diffuse_color=(*[linear((color>>shift)&255) for shift in (16,8,0)],1)
    material.use_nodes=True
    bsdf=material.node_tree.nodes.get('Principled BSDF')
    bsdf.inputs['Base Color'].default_value=material.diffuse_color
    bsdf.inputs['Roughness'].default_value=.77
    if label=='Laternenglas':
        bsdf.inputs['Emission Color'].default_value=material.diffuse_color
        bsdf.inputs['Emission Strength'].default_value=1.45
    obj.data.materials.append(material)

bpy.ops.wm.save_as_mainfile(filepath=str(ROOT/'Burg-Lichtfels.blend'))
bpy.ops.export_scene.gltf(filepath=str(ROOT/'Burg-Lichtfels.glb'),export_format='GLB')

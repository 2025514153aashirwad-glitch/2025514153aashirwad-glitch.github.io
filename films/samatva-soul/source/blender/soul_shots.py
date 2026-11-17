"""SAMATVA soul film: the photoreal shots.
blender -b --factory-startup -P soul_shots.py -- <shot> <pass> <outdir> [--frames a-b] [--samples N] [--res WxH]
shot: reform | build | gen | loop | finale      pass: metal | thermal
Frames are rendered at 12 fps (slow, eased camera moves) and interpolated to 24 fps afterwards.
Built from the traced Samatwam marks (brand/logo/vector) and one CC0 HDRI. No other assets."""
import bpy, sys, os, math, json, addon_utils
from mathutils import Vector

A = sys.argv[sys.argv.index('--') + 1:]
SHOT, PASS, OUTDIR = A[0], A[1], A[2]
opt = {A[i]: A[i + 1] for i in range(3, len(A) - 1, 2)}
FPS = int(opt.get('--fps', 8))
VEC = os.environ.get('SAMATVA_VEC', '/home/user/2025514153aashirwad-glitch.github.io/brand/logo/vector')
HDRI = os.environ.get('SAMATVA_HDRI', '/home/user/tools/assets/hdri/brown_photostudio_02.hdr')
LEN = {'reform': 14, 'build': 14, 'gen': 13, 'loop': 12, 'finale': 12}[SHOT]
NF = LEN * FPS

sc = bpy.context.scene
for o in list(bpy.data.objects): bpy.data.objects.remove(o)
sc.render.engine = 'CYCLES'; sc.cycles.device = 'CPU'
sc.cycles.samples = int(opt.get('--samples', 10 if PASS == 'metal' else 10)); sc.cycles.use_denoising = True
sc.cycles.denoiser = 'OPENIMAGEDENOISE'; sc.cycles.use_adaptive_sampling = True; sc.cycles.adaptive_threshold = .035
rw, rh = map(int, opt.get('--res', '1280x720').split('x')); sc.render.resolution_x, sc.render.resolution_y = rw, rh
sc.view_settings.view_transform = 'AgX'; sc.view_settings.look = 'AgX - Medium High Contrast'
sc.render.fps = FPS; sc.frame_start, sc.frame_end = 1, NF
FMT = os.environ.get('SAMATVA_FORMAT', 'PNG')   # PNG here; JPEG (quality 95) to save space on Colab/Drive
sc.render.image_settings.file_format = FMT; sc.render.image_settings.color_mode = 'RGB'
if FMT == 'JPEG': sc.render.image_settings.quality = 95
EXT = 'jpg' if FMT == 'JPEG' else 'png'
DEV = os.environ.get('SAMATVA_DEVICE', 'CPU')   # CPU here; OPTIX or CUDA on a graphics card (e.g. Kaggle)
if DEV != 'CPU':
    pr = bpy.context.preferences.addons['cycles'].preferences; pr.compute_device_type = DEV; pr.get_devices()
    for d in pr.devices: d.use = (d.type == DEV)
    sc.cycles.device = 'GPU'; print('GPU devices:', [d.name for d in pr.devices if d.use])
sc.cycles.max_bounces = 4; sc.cycles.glossy_bounces = 3; sc.cycles.transmission_bounces = 1; sc.cycles.diffuse_bounces = 2

def ease(x): x = max(0, min(1, x)); return x * x * (3 - 2 * x)
def ease5(x): x = max(0, min(1, x)); return x * x * x * (x * (x * 6 - 15) + 10)

# ------------------------------------------------------------------ materials
def nodes(m): return m.node_tree.nodes, m.node_tree.links
def mat_metal(name, col, rough, aniso=0.0, smudge=.08):
    m = bpy.data.materials.new(name); m.use_nodes = True; N, Lk = nodes(m); b = N['Principled BSDF']
    b.inputs['Base Color'].default_value = (*col, 1); b.inputs['Metallic'].default_value = 1.0
    if aniso:
        b.inputs['Anisotropic'].default_value = aniso
        tan = N.new('ShaderNodeTangent'); tan.direction_type = 'RADIAL'; tan.axis = 'Z'; Lk.new(tan.outputs[0], b.inputs['Tangent'])
    # roughness = base + fine machining grain + large soft smudges (handled metal, not CG-perfect)
    fine = N.new('ShaderNodeTexNoise'); fine.inputs['Scale'].default_value = 900; fine.inputs['Detail'].default_value = 2
    big = N.new('ShaderNodeTexNoise'); big.inputs['Scale'].default_value = 3.5; big.inputs['Detail'].default_value = 4; big.inputs['Roughness'].default_value = .65
    r1 = N.new('ShaderNodeMapRange'); r1.inputs['To Min'].default_value = rough * .85; r1.inputs['To Max'].default_value = rough * 1.15
    r2 = N.new('ShaderNodeMapRange'); r2.inputs['From Min'].default_value = .45; r2.inputs['From Max'].default_value = .75; r2.inputs['To Min'].default_value = 0; r2.inputs['To Max'].default_value = smudge
    add = N.new('ShaderNodeMath'); add.operation = 'ADD'; add.use_clamp = True
    Lk.new(fine.outputs['Fac'], r1.inputs['Value']); Lk.new(big.outputs['Fac'], r2.inputs['Value'])
    Lk.new(r1.outputs['Result'], add.inputs[0]); Lk.new(r2.outputs['Result'], add.inputs[1]); Lk.new(add.outputs[0], b.inputs['Roughness'])
    # micro dents
    dn = N.new('ShaderNodeTexNoise'); dn.inputs['Scale'].default_value = 260; bump = N.new('ShaderNodeBump'); bump.inputs['Strength'].default_value = .03
    Lk.new(dn.outputs['Fac'], bump.inputs['Height']); Lk.new(bump.outputs['Normal'], b.inputs['Normal'])
    return m

def mat_enamel(col):
    m = bpy.data.materials.new('enamel'); m.use_nodes = True; b = m.node_tree.nodes['Principled BSDF']
    b.inputs['Base Color'].default_value = (*col, 1); b.inputs['Roughness'].default_value = .08
    b.inputs['Coat Weight'].default_value = 1.0; b.inputs['Coat Roughness'].default_value = .03
    return m

def mat_ground(kind):
    m = bpy.data.materials.new('ground'); m.use_nodes = True; N, Lk = nodes(m); b = N['Principled BSDF']
    if kind == 'wood':
        w = N.new('ShaderNodeTexWave'); w.wave_type = 'BANDS'; w.inputs['Scale'].default_value = 1.6; w.inputs['Distortion'].default_value = 11; w.inputs['Detail'].default_value = 8
        r = N.new('ShaderNodeValToRGB'); r.color_ramp.elements[0].color = (.006, .003, .0015, 1); r.color_ramp.elements[1].color = (.03, .014, .006, 1)
        Lk.new(w.outputs['Fac'], r.inputs['Fac']); Lk.new(r.outputs['Color'], b.inputs['Base Color']); b.inputs['Roughness'].default_value = .5
        bump = N.new('ShaderNodeBump'); bump.inputs['Strength'].default_value = .15; Lk.new(w.outputs['Fac'], bump.inputs['Height']); Lk.new(bump.outputs['Normal'], b.inputs['Normal'])
    else:
        n = N.new('ShaderNodeTexNoise'); n.inputs['Scale'].default_value = 40; n.inputs['Detail'].default_value = 8
        r = N.new('ShaderNodeValToRGB'); r.color_ramp.elements[0].color = (.002, .002, .0025, 1); r.color_ramp.elements[1].color = (.01, .01, .011, 1)
        Lk.new(n.outputs['Fac'], r.inputs['Fac']); Lk.new(r.outputs['Color'], b.inputs['Base Color']); b.inputs['Roughness'].default_value = .9
    return m

LOOKS = {
    'sun':     dict(disc=((0.50, 0.33, 0.15), .36), relief=((0.78, 0.55, 0.26), .22)),
    'wheel':   dict(disc=((0.55, 0.56, 0.58), .32), relief=((0.80, 0.81, 0.83), .2)),
    'hexagon': dict(disc=((0.30, 0.17, 0.09), .42), relief=((0.55, 0.33, 0.16), .26)),
    'octagon': dict(disc=((0.16, 0.155, 0.15), .62), relief=((0.26, 0.25, 0.24), .48)),
}

# ------------------------------------------------------------------ one medallion from the traced mark
addon_utils.enable('io_curve_svg', default_set=True)
R = 1.0
def medallion(variant, at=(0, 0, 0), rot=0.0):
    L = LOOKS[variant]; root = bpy.data.objects.new(f'{variant}-root', None); sc.collection.objects.link(root)
    bpy.ops.mesh.primitive_cylinder_add(vertices=256, radius=R, depth=.12, location=(0, 0, -.06)); disc = bpy.context.object
    bev = disc.modifiers.new('bev', 'BEVEL'); bev.width = .025; bev.segments = 6; bev.limit_method = 'ANGLE'
    bpy.ops.object.shade_smooth(); disc.data.materials.append(mat_metal(f'{variant}-disc', *L['disc'], aniso=.6)); disc.parent = root
    bpy.ops.mesh.primitive_torus_add(major_radius=R * .965, minor_radius=.022, major_segments=256, minor_segments=24)
    rim = bpy.context.object; bpy.ops.object.shade_smooth(); rim.data.materials.append(mat_metal(f'{variant}-rim', *L['relief'])); rim.parent = root
    parts = {}
    for part in ('crescent', 'infinity', 'emblem', 'triangles'):
        before = set(bpy.data.objects); bpy.ops.import_curve.svg(filepath=os.path.join(VEC, f'{variant}-{part}.svg'))
        new = [o for o in bpy.data.objects if o not in before and o.type == 'CURVE']
        bpy.ops.object.select_all(action='DESELECT')
        for o in new: o.select_set(True)
        bpy.context.view_layer.objects.active = new[0]
        if len(new) > 1: bpy.ops.object.join()
        parts[part] = bpy.context.view_layer.objects.active
    for o in parts.values(): o.data.dimensions = '2D'
    bpy.context.view_layer.update()
    mn = Vector((1e9, 1e9, 0)); mx = Vector((-1e9, -1e9, 0))
    for o in parts.values():
        for c in o.bound_box:
            w = o.matrix_world @ Vector(c); mn.x, mn.y = min(mn.x, w.x), min(mn.y, w.y); mx.x, mx.y = max(mx.x, w.x), max(mx.y, w.y)
    s = 1.36 * R / (mx.y - mn.y); ctr = (mn + mx) / 2
    relief = mat_metal(f'{variant}-relief', *L['relief'])
    for name, o in parts.items():
        o.location = (o.location - ctr) * s; o.scale = o.scale * s
        o.data.extrude = .007 / s; o.data.bevel_depth = .0035 / s; o.data.bevel_resolution = 3; o.data.fill_mode = 'BOTH'
        o.location.z = .007; o.data.materials.clear(); o.data.materials.append(relief); o.name = f'{variant}-{name}'
    # pixel -> local mapping of the traced artwork (for the loop path)
    half = Vector(((mx.x - mn.x) * s / 2, (mx.y - mn.y) * s / 2, 0))
    for o in parts.values():
        o.parent = root; o.matrix_parent_inverse.identity()
    root.location = at; root.rotation_euler = (0, 0, rot)
    return dict(root=root, parts=parts, relief=relief, half=half, look=L)

def pivot(o, center):
    """Re-centre an object's origin (e.g. the emblem) so it can turn about its own middle."""
    bpy.context.view_layer.update()
    ws = [o.matrix_world @ Vector(c) for c in o.bound_box]; c = sum(ws, Vector()) / 8
    sc.cursor.location = c; bpy.ops.object.select_all(action='DESELECT'); o.select_set(True); bpy.context.view_layer.objects.active = o
    bpy.ops.object.origin_set(type='ORIGIN_CURSOR'); return c

def set_mat(o, m): o.data.materials.clear(); o.data.materials.append(m)

# ------------------------------------------------------------------ studio: ground, world, lights, camera rig
def studio(ground='slate', key_col=(1, .85, .7)):
    bpy.ops.mesh.primitive_plane_add(size=40, location=(0, 0, -.121)); g = bpy.context.object; g.data.materials.append(mat_ground(ground))
    w = bpy.data.worlds.new('w'); sc.world = w; w.use_nodes = True; nt = w.node_tree
    env = nt.nodes.new('ShaderNodeTexEnvironment'); env.image = bpy.data.images.load(HDRI)
    nt.links.new(env.outputs[0], nt.nodes['Background'].inputs[0]); nt.nodes['Background'].inputs[1].default_value = .12
    rig = bpy.data.objects.new('keyrig', None); sc.collection.objects.link(rig)
    bpy.ops.object.light_add(type='AREA', location=(-3.2, 2.4, 1.15)); key = bpy.context.object
    key.data.energy = 420; key.data.size = 1.0; key.data.color = key_col; key.parent = rig
    tk = key.constraints.new('TRACK_TO'); tk.target = rig; tk.track_axis = 'TRACK_NEGATIVE_Z'; tk.up_axis = 'UP_Y'
    bpy.ops.object.light_add(type='AREA', location=(3.5, -1.0, 2.5)); fill = bpy.context.object; fill.data.energy = 25; fill.data.size = 4
    tf = fill.constraints.new('TRACK_TO'); tf.target = rig; tf.track_axis = 'TRACK_NEGATIVE_Z'; tf.up_axis = 'UP_Y'
    bpy.ops.object.light_add(type='SPOT', location=(0.3, -0.6, 4.2)); sp = bpy.context.object
    sp.data.energy = 900; sp.data.spot_size = math.radians(34); sp.data.spot_blend = .6; sp.data.color = key_col
    ts = sp.constraints.new('TRACK_TO'); ts.target = rig; ts.track_axis = 'TRACK_NEGATIVE_Z'; ts.up_axis = 'UP_Y'
    tgt = bpy.data.objects.new('aim', None); sc.collection.objects.link(tgt)
    bpy.ops.object.camera_add(); cam = bpy.context.object; sc.camera = cam
    tc = cam.constraints.new('TRACK_TO'); tc.target = tgt; tc.track_axis = 'TRACK_NEGATIVE_Z'; tc.up_axis = 'UP_Y'
    cam.data.dof.use_dof = True; cam.data.dof.focus_object = tgt; cam.data.dof.aperture_fstop = 2.0
    cam.data.sensor_width = 36
    return dict(rig=rig, key=key, spot=sp, cam=cam, aim=tgt)

def key_path(obj, attr, fn):
    """Keyframe obj.attr = fn(t) on every rendered frame (t in seconds), with linear interpolation."""
    for f in range(1, NF + 1):
        t = (f - 1) / FPS; v = fn(t); setattr(obj, attr, v); obj.keyframe_insert(attr, frame=f)
    if obj.animation_data and obj.animation_data.action:
        for fc in obj.animation_data.action.fcurves:
            for kp in fc.keyframe_points: kp.interpolation = 'LINEAR'

def key_input(sock, fn):
    for f in range(1, NF + 1):
        sock.default_value = fn((f - 1) / FPS); sock.keyframe_insert('default_value', frame=f)

def lerpv(a, b, k): return Vector(a).lerp(Vector(b), k)

# ------------------------------------------------------------------ the thermal pass (ironbow false colour of the same scene)
def thermal_override(hot_at=(0, .35, 0), hot_r=.55, base=.16, flow=1.0, hot_gain=.55, hot_fn=None):
    m = bpy.data.materials.new('thermal'); m.use_nodes = True; N, Lk = nodes(m)
    for n in list(N): N.remove(n)
    out = N.new('ShaderNodeOutputMaterial'); em = N.new('ShaderNodeEmission'); Lk.new(em.outputs[0], out.inputs['Surface'])
    geo = N.new('ShaderNodeNewGeometry')
    tval = N.new('ShaderNodeValue'); tval.name = 'time'
    # convection: noise drifting upward through the scene
    comb = N.new('ShaderNodeCombineXYZ'); mulz = N.new('ShaderNodeMath'); mulz.operation = 'MULTIPLY'; mulz.inputs[1].default_value = -.35 * flow
    Lk.new(tval.outputs[0], mulz.inputs[0]); Lk.new(mulz.outputs[0], comb.inputs['Y'])
    addv = N.new('ShaderNodeVectorMath'); addv.operation = 'ADD'; Lk.new(geo.outputs['Position'], addv.inputs[0]); Lk.new(comb.outputs[0], addv.inputs[1])
    nz = N.new('ShaderNodeTexNoise'); nz.noise_dimensions = '4D'; nz.inputs['Scale'].default_value = 2.2; nz.inputs['Detail'].default_value = 5; nz.inputs['Roughness'].default_value = .55
    Lk.new(addv.outputs[0], nz.inputs['Vector']); Lk.new(tval.outputs[0], nz.inputs['W'])
    # warm core: radial falloff from the source of heat
    sub = N.new('ShaderNodeVectorMath'); sub.operation = 'DISTANCE'; sub.inputs[1].default_value = hot_at; Lk.new(geo.outputs['Position'], sub.inputs[0])
    core = N.new('ShaderNodeMapRange'); core.inputs['From Min'].default_value = 0; core.inputs['From Max'].default_value = hot_r * 2.2; core.inputs['To Min'].default_value = 1; core.inputs['To Max'].default_value = 0
    Lk.new(sub.outputs['Value'], core.inputs['Value'])
    gain = N.new('ShaderNodeValue'); gain.name = 'hotgain'; gain.outputs[0].default_value = hot_gain
    cm = N.new('ShaderNodeMath'); cm.operation = 'MULTIPLY'; Lk.new(core.outputs['Result'], cm.inputs[0]); Lk.new(gain.outputs[0], cm.inputs[1])
    # raised metal (facing the camera) reads warmer than the cold table
    lw = N.new('ShaderNodeLayerWeight'); lw.inputs['Blend'].default_value = .35
    fm = N.new('ShaderNodeMath'); fm.operation = 'MULTIPLY'; fm.inputs[1].default_value = -.18; Lk.new(lw.outputs['Facing'], fm.inputs[0])
    objz = N.new('ShaderNodeSeparateXYZ'); Lk.new(geo.outputs['Position'], objz.inputs[0])
    lift = N.new('ShaderNodeMapRange'); lift.inputs['From Min'].default_value = -.13; lift.inputs['From Max'].default_value = -.10; lift.inputs['To Min'].default_value = -.3; lift.inputs['To Max'].default_value = 0
    Lk.new(objz.outputs['Z'], lift.inputs['Value'])
    s1 = N.new('ShaderNodeMath'); s1.operation = 'MULTIPLY_ADD'; s1.inputs[1].default_value = .36; s1.inputs[2].default_value = base
    Lk.new(nz.outputs['Fac'], s1.inputs[0])
    s2 = N.new('ShaderNodeMath'); s2.operation = 'ADD'; Lk.new(s1.outputs[0], s2.inputs[0]); Lk.new(cm.outputs[0], s2.inputs[1])
    s3 = N.new('ShaderNodeMath'); s3.operation = 'ADD'; Lk.new(s2.outputs[0], s3.inputs[0]); Lk.new(fm.outputs[0], s3.inputs[1])
    s4 = N.new('ShaderNodeMath'); s4.operation = 'ADD'; s4.use_clamp = True; Lk.new(s3.outputs[0], s4.inputs[0]); Lk.new(lift.outputs['Result'], s4.inputs[1])
    # ironbow palette, as a thermal camera shows it
    ramp = N.new('ShaderNodeValToRGB'); E = ramp.color_ramp.elements
    stops = [(0, (0, 0, 0)), (.16, (.01, .0, .09)), (.32, (.12, .0, .38)), (.48, (.55, .02, .42)), (.62, (.92, .2, .06)), (.76, (1, .52, 0)), (.9, (1, .86, .25)), (1, (1, 1, .9))]
    E[0].position, E[0].color = 0, (0, 0, 0, 1); E[1].position, E[1].color = 1, (1, 1, .9, 1)
    for p, c in stops[1:-1]: e = E.new(p); e.color = (*c, 1)
    Lk.new(s4.outputs[0], ramp.inputs['Fac']); Lk.new(ramp.outputs['Color'], em.inputs['Color']); em.inputs['Strength'].default_value = 1.0
    sc.view_layers[0].material_override = m
    sc.view_settings.view_transform = 'Standard'; sc.view_settings.look = 'None'
    sc.world.node_tree.nodes['Background'].inputs[1].default_value = 0
    for o in sc.objects:
        if o.type == 'LIGHT': o.hide_render = True
    key_input(tval.outputs[0], lambda t: t)
    if hot_fn: key_input(gain.outputs[0], hot_fn)
    sc.cycles.samples = int(opt.get('--samples', 12))
    return m

# ================================================================== the shots
def shot_reform():
    M = medallion('wheel'); S = studio('slate', (.92, .95, 1.0))
    tri = M['parts']['triangles']; set_mat(tri, mat_enamel((.004, .022, .2))); tri.location.z = .0015
    em = M['parts']['emblem']; c = pivot(em, None)
    # the wheel turns one notch (45 degrees) on each spoken beat: observes / logs / structures
    beats = [1.6, 3.0, 4.4, 9.6]
    key_path(em, 'rotation_euler', lambda t: (0, 0, -math.radians(45) * sum(ease5((t - b) / .9) for b in beats)))
    # slider: low and close over the enamel, rising to the wheel; focus pulls with it
    key_path(S['cam'], 'location', lambda t: lerpv((-1.1, -2.2, .55), (.35, -2.9, 2.25), ease(t / LEN)))
    key_path(S['aim'], 'location', lambda t: lerpv((-.35, -.42, 0), (c.x, c.y, 0), ease((t - 1) / (LEN - 3))))
    S['cam'].data.lens = 85
    key_path(S['rig'], 'rotation_euler', lambda t: (0, 0, math.radians(-18 + 30 * t / LEN)))
    return dict(hot_at=(c.x, c.y, 0), hot_r=.45)

def shot_build():
    M = medallion('hexagon'); S = studio('slate', (1.0, .78, .55))
    em = M['parts']['emblem']; c = pivot(em, None)
    m = mat_metal('hot', (0.45, 0.25, 0.12), .35); N, Lk = nodes(m); b = N['Principled BSDF']
    geo = N.new('ShaderNodeNewGeometry'); mp = N.new('ShaderNodeMapping'); gr = N.new('ShaderNodeTexGradient'); gr.gradient_type = 'SPHERICAL'
    bpy.context.view_layer.update(); ws = [em.matrix_world @ Vector(v) for v in em.bound_box]; rad = max(max(v.x for v in ws) - c.x, max(v.y for v in ws) - c.y) * 1.05
    k = 1 / rad; mp.inputs['Scale'].default_value = (k, k, k); mp.inputs['Location'].default_value = (-c.x * k, -c.y * k, 0)
    Lk.new(geo.outputs['Position'], mp.inputs['Vector']); Lk.new(mp.outputs['Vector'], gr.inputs['Vector'])
    bb = N.new('ShaderNodeBlackbody'); Lk.new(bb.outputs[0], b.inputs['Emission Color'])
    mul = N.new('ShaderNodeMath'); mul.operation = 'MULTIPLY'; Lk.new(gr.outputs['Fac'], mul.inputs[0]); Lk.new(mul.outputs[0], b.inputs['Emission Strength'])
    set_mat(em, m)
    # the pour cools: from white-hot to a last ember, then dark bronze
    key_input(mul.inputs[1], lambda t: 26 * (1 - ease((t - 2.5) / 9)) ** 2 + .0)
    key_input(bb.inputs['Temperature'], lambda t: 1700 - 800 * ease((t - 2.5) / 9))
    key_path(S['cam'], 'location', lambda t: lerpv((.25, -1.25, 2.6), (-.55, -3.4, 2.0), ease(t / LEN)))
    key_path(S['aim'], 'location', lambda t: lerpv((c.x, c.y, 0), (0, .05, 0), ease((t - 2) / (LEN - 2))))
    S['cam'].data.lens = 70
    key_path(S['rig'], 'rotation_euler', lambda t: (0, 0, math.radians(10 - 24 * t / LEN)))
    return dict(hot_at=(c.x, c.y, 0), hot_r=.4)

def shot_gen():
    M = medallion('octagon'); S = studio('slate', (.95, .95, .95))
    tri = M['parts']['triangles']; m = mat_metal('polish', (.26, .25, .24), .48, smudge=0); N, Lk = nodes(m)
    b = N['Principled BSDF']
    # the hollow triangles fill with light and polish to a mirror as new people arrive
    for lk in list(b.inputs['Roughness'].links): Lk.remove(lk)
    key_input(b.inputs['Roughness'], lambda t: .48 - .44 * ease((t - 3.5) / 6))
    key_input(b.inputs['Base Color'], lambda t: (*lerpv((.26, .25, .24), (.95, .93, .9), ease((t - 3.5) / 6)), 1))
    set_mat(tri, m)
    key_path(S['cam'], 'location', lambda t: lerpv((.95, -2.5, .75), (.25, -3.7, 1.75), ease(t / LEN)))
    key_path(S['aim'], 'location', lambda t: lerpv((.3, -.45, 0), (0, -.38, 0), ease(t / LEN)))
    S['cam'].data.lens = 80
    key_path(S['rig'], 'rotation_euler', lambda t: (0, 0, math.radians(-30 + 40 * t / LEN)))
    return dict(hot_at=(0, -.4, 0), hot_r=.6)

def loop_path(M):
    """Centre line of the brass infinity, measured from the logo file, in medallion space."""
    J = json.load(open(os.path.join(VEC, 'sun-looppath.json'))); bb = J['bbox']
    W, H = bb['x1'] - bb['x0'], bb['y1'] - bb['y0']; hx, hy = M['half'].x, M['half'].y
    to = lambda p: Vector(((p[0] - bb['x0']) / W * 2 * hx - hx, hy - (p[1] - bb['y0']) / H * 2 * hy, .016))
    Lp, Rp = [to(p) for p in J['loops'][0]['pts']], [to(p) for p in J['loops'][1]['pts']]
    # start each loop at its point nearest the crossing; left loop runs one way, right loop the other (a figure eight)
    cross = (sum(Lp, Vector()) / len(Lp) + sum(Rp, Vector()) / len(Rp)) / 2
    def start(P): i = min(range(len(P)), key=lambda k: (P[k] - cross).length); return P[i:] + P[:i]
    Lp, Rp = start(Lp), start(Rp)[::-1]
    return Lp + Rp

def shot_loop():
    M = medallion('sun'); S = studio('wood', (1.0, .82, .62))
    inf = M['parts']['infinity']; path = loop_path(M); n = len(path)
    # four lights run inside the brass line itself, equally spaced: citizen, student, paraprofessional, professional
    m = mat_metal('inf', *LOOKS['sun']['relief']); N, Lk = nodes(m); b = N['Principled BSDF']
    geo = N.new('ShaderNodeNewGeometry'); acc = None; socks = []
    for i in range(4):
        cv = N.new('ShaderNodeCombineXYZ'); d = N.new('ShaderNodeVectorMath'); d.operation = 'DISTANCE'
        Lk.new(geo.outputs['Position'], d.inputs[0]); Lk.new(cv.outputs[0], d.inputs[1])
        g = N.new('ShaderNodeMapRange'); g.interpolation_type = 'SMOOTHERSTEP'; g.inputs['From Min'].default_value = 0; g.inputs['From Max'].default_value = .06
        g.inputs['To Min'].default_value = 1; g.inputs['To Max'].default_value = 0; Lk.new(d.outputs['Value'], g.inputs['Value'])
        if acc is None: acc = g.outputs['Result']
        else: a = N.new('ShaderNodeMath'); a.operation = 'ADD'; Lk.new(acc, a.inputs[0]); Lk.new(g.outputs['Result'], a.inputs[1]); acc = a.outputs[0]
        socks.append(cv)
    s = N.new('ShaderNodeMath'); s.operation = 'MULTIPLY'; s.inputs[1].default_value = 45; Lk.new(acc, s.inputs[0]); Lk.new(s.outputs[0], b.inputs['Emission Strength'])
    b.inputs['Emission Color'].default_value = (1, .78, .5, 1); set_mat(inf, m)
    speed = .085   # loops per second
    lights = []
    for i in range(4):
        bpy.ops.object.light_add(type='POINT'); pl = bpy.context.object; pl.data.energy = .5; pl.data.shadow_soft_size = .02; pl.data.color = (1, .78, .5); lights.append(pl)
    world = inf.parent.matrix_world
    def pos(i, t):
        u = ((t * speed + i / 4) % 1) * n; k = int(u); f = u - k
        return world @ path[k % n].lerp(path[(k + 1) % n], f)
    for i, cv in enumerate(socks):
        for ax, name in ((0, 'X'), (1, 'Y'), (2, 'Z')): key_input(cv.inputs[name], lambda t, i=i, ax=ax: pos(i, t)[ax])
        key_path(lights[i], 'location', lambda t, i=i: pos(i, t) + Vector((0, 0, .03)))
    # low, close, tracking along the loop; then lifting to see the whole figure eight
    key_path(S['cam'], 'location', lambda t: lerpv((-1.2, -1.6, .42), (.2, -2.8, 1.65), ease(t / LEN)))
    key_path(S['aim'], 'location', lambda t: lerpv((-.3, -.42, 0), (0, -.3, 0), ease(t / LEN)))
    S['cam'].data.lens = 75
    key_path(S['rig'], 'rotation_euler', lambda t: (0, 0, math.radians(-10 + 20 * t / LEN)))
    return dict(hot_at=(0, -.4, 0), hot_r=.6)

def shot_finale():
    # the family: Reform, Build and Generation behind, the master sun in front
    medallion('sun', at=(0, -.2, 0)); medallion('wheel', at=(-2.35, 2.1, 0), rot=.12); medallion('hexagon', at=(0, 2.6, 0)); medallion('octagon', at=(2.35, 2.1, 0), rot=-.12)
    S = studio('wood', (1.0, .84, .66))
    S['spot'].data.spot_size = math.radians(60); S['spot'].location = (0, -.5, 7.5); S['spot'].data.energy = 1500
    S['rig'].location = (0, 1.0, 0); S['key'].data.energy = 260
    key_path(S['cam'], 'location', lambda t: lerpv((.1, -1.15, 1.9), (0, -6.6, 6.2), ease5(t / (LEN - 1.5))))
    key_path(S['aim'], 'location', lambda t: lerpv((0, .05, 0), (0, 1.15, 0), ease5(t / (LEN - 1.5))))
    S['cam'].data.lens = 50
    for f in range(1, NF + 1):
        S['cam'].data.dof.aperture_fstop = 2.0 + 4.0 * ease((f - 1) / FPS / (LEN - 1.5)); S['cam'].data.keyframe_insert('dof.aperture_fstop', frame=f)
    return dict(hot_at=(0, 0, 0), hot_r=1)

info = {'reform': shot_reform, 'build': shot_build, 'gen': shot_gen, 'loop': shot_loop, 'finale': shot_finale}[SHOT]()
if PASS == 'thermal':
    hot = {'reform': lambda t: .45, 'build': lambda t: .5, 'gen': lambda t: .35}.get(SHOT)
    thermal_override(hot_at=info['hot_at'], hot_r=info['hot_r'], hot_fn=hot)

a, b = map(int, opt.get('--frames', f'1-{NF}').split('-'))
os.makedirs(OUTDIR, exist_ok=True)
for f in range(a, b + 1):
    fp = os.path.join(OUTDIR, f'{f:04d}.{EXT}')
    if os.path.exists(fp) and os.path.getsize(fp) > 0: continue
    import time; t0 = time.time(); sc.frame_set(f); sc.render.filepath = fp; bpy.ops.render.render(write_still=True); print('FRAMETIME', f, round(time.time() - t0, 1), flush=True)
print('DONE', SHOT, PASS, a, b)

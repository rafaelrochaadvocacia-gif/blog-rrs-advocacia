#!/usr/bin/env python3
# Uso: python3 cover_gen.py "TITULO DO ARTIGO" /caminho/saida.png
# Gera a capa 1080x1350 no padrao do blog RRS (navy + monograma real + titulo bicolor).
import sys, os
from PIL import Image, ImageDraw, ImageFont
_HERE=os.path.dirname(os.path.abspath(__file__))

W,H=1080,1350
NAVY=(30,58,95); NAVY2=(20,42,72); GOLD=(209,166,111); CREAM=(250,246,240)
# logo monograma em fundo navy (mesmo navy da capa -> funde perfeitamente)
LOGO_CANDIDATES=[
 os.path.join(_HERE, "..", "Logo final RRS fundado azul marinho .png"),
 os.path.join(_HERE, "Logo final RRS fundado azul marinho .png"),
]
SERIF_B="/usr/share/fonts/truetype/dejavu/DejaVuSerif-Bold.ttf"
SERIF="/usr/share/fonts/truetype/dejavu/DejaVuSerif.ttf"
SERIF_I="/usr/share/fonts/truetype/dejavu/DejaVuSerif-Italic.ttf"

def load_mono():
    for p in LOGO_CANDIDATES:
        try:
            im=Image.open(p).convert("RGBA"); px=im.load(); Wm,Hm=im.size
            minx,miny,maxx,maxy=Wm,Hm,0,0
            for y in range(0,Hm,2):
                for x in range(0,Wm,2):
                    r,g,b,a=px[x,y]
                    if abs(r-30)+abs(g-58)+abs(b-95)>60:
                        minx=min(minx,x);maxx=max(maxx,x);miny=min(miny,y);maxy=max(maxy,y)
            crop=im.crop((max(0,minx-20),max(0,miny-20),min(Wm,maxx+20),min(Hm,maxy+20))).convert("RGBA")
            d=crop.load()
            for y in range(crop.height):
                for x in range(crop.width):
                    r,g,b,a=d[x,y]; dist=abs(r-30)+abs(g-58)+abs(b-95)
                    if dist<70: d[x,y]=(r,g,b,0)
                    elif dist<140: d[x,y]=(r,g,b,int(255*(dist-70)/70))
            return crop
        except Exception: continue
    return None

def make_cover(title,out,split_marker=":"):
    img=Image.new("RGB",(W,H),NAVY); d=ImageDraw.Draw(img)
    for y in range(H):
        t=y/H; d.line([(0,y),(W,y)],fill=tuple(int(NAVY[i]+(NAVY2[i]-NAVY[i])*t) for i in range(3)))
    cx=W//2; MONO=load_mono()
    if MONO:
        mh=300; mw=int(MONO.width*mh/MONO.height); m=MONO.resize((mw,mh)).convert("RGBA")
        img.paste(m,(cx-mw//2,70),m)
    d.text((cx,420),"RAFAEL ROCHA E SANTOS",font=ImageFont.truetype(SERIF_B,42),fill=CREAM,anchor="mm")
    d.text((cx,462)," ".join("ADVOCACIA"),font=ImageFont.truetype(SERIF,26),fill=GOLD,anchor="mm")
    d.line([(cx-80,500),(cx+80,500)],fill=GOLD,width=2)
    if split_marker in title:
        i=title.index(split_marker)+len(split_marker); gp=title[:i].strip(); wp=title[i:].strip()
    else: gp=title; wp=""
    words=[(w,GOLD) for w in gp.split()]+[(w,CREAM) for w in wp.split()]
    size=80
    while size>=42:
        f=ImageFont.truetype(SERIF_B,size); sp=d.textlength(" ",font=f); lines=[];cur=[];cw=0
        for w,col in words:
            ww=d.textlength(w,font=f)
            if cur and cw+sp+ww>W-150: lines.append(cur);cur=[];cw=0
            cur.append((w,col,ww)); cw=(cw+sp+ww) if len(cur)>1 else ww
        if cur: lines.append(cur)
        if len(lines)*size*1.2<=560 and len(lines)<=7: break
        size-=3
    f=ImageFont.truetype(SERIF_B,size); sp=d.textlength(" ",font=f); lh=size*1.2
    sy=540+((H-250-540)-len(lines)*lh)/2
    for li,line in enumerate(lines):
        lw=sum(w[2] for w in line)+sp*(len(line)-1); x=cx-lw/2; y=sy+li*lh
        for w,col,ww in line: d.text((x,y),w,font=f,fill=col); x+=ww+sp
    d.text((cx,H-185),"Seu Direito. Nossa Luta!",font=ImageFont.truetype(SERIF_I,40),fill=GOLD,anchor="mm")
    d.text((cx,H-135),"Juiz de Fora/MG  -  Atendimento em todo o Brasil",font=ImageFont.truetype(SERIF,25),fill=CREAM,anchor="mm")
    ext=os.path.splitext(out)[1].lower()
    if ext==".webp": img.save(out,"WEBP",quality=90,method=6)
    elif ext in (".jpg",".jpeg"): img.save(out.replace(ext,".jpg"),"JPEG",quality=90)
    else: img.save(out,"PNG")
    print("OK",out)

if __name__=="__main__":
    make_cover(sys.argv[1], sys.argv[2] if len(sys.argv)>2 else "capa.png")

/*
  Flod JS 2.0
  2012/04/01
  Christian Corti
  Neoart Costa Rica

  Last Update: Flod JS 2.0 - 2012/03/10

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
  OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
  LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR
  IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

  This work is licensed under the Creative Commons Attribution-Noncommercial-Share Alike 3.0 Unported License.
  To view a copy of this license, visit http://creativecommons.org/licenses/by-nc-sa/3.0/ or send a letter to
  Creative Commons, 171 Second Street, Suite 300, San Francisco, California, 94105, USA.
*/
(function(){function k(i){return Object.create(null,{index:{value:i,writable:!0},next:{value:null,writable:!0},channel:{value:null,writable:!0},step:{value:null,writable:!0},row:{value:null,writable:!0},instr:{value:null,writable:!0},sample:{value:null,writable:!0},enabled:{value:0,writable:!0},pattern:{value:0,writable:!0},instrument:{value:0,writable:!0},note:{value:0,writable:!0},period:{value:0,writable:!0},volume:{value:0,writable:!0},original:{value:0,writable:!0},adsrPos:{value:0,writable:!0},
sustainCtr:{value:0,writable:!0},pitchBend:{value:0,writable:!0},pitchBendCtr:{value:0,writable:!0},noteSlideTo:{value:0,writable:!0},noteSlideSpeed:{value:0,writable:!0},waveCtr:{value:0,writable:!0},wavePos:{value:0,writable:!0},arpeggioCtr:{value:0,writable:!0},arpeggioPos:{value:0,writable:!0},vibratoCtr:{value:0,writable:!0},vibratoPos:{value:0,writable:!0},speed:{value:0,writable:!0},initialize:{value:function(){this.sample=this.instr=this.row=this.step=null;this.speed=this.vibratoPos=this.vibratoCtr=
this.arpeggioPos=this.arpeggioCtr=this.wavePos=this.waveCtr=this.noteSlideSpeed=this.noteSlideTo=this.pitchBendCtr=this.pitchBend=this.sustainCtr=this.adsrPos=this.original=this.volume=this.period=this.note=this.instrument=this.pattern=this.enabled=0}}})}function m(){return Object.create(null,{wave:{value:0,writable:!0},waveLen:{value:0,writable:!0},waveDelay:{value:0,writable:!0},waveSpeed:{value:0,writable:!0},arpeggio:{value:0,writable:!0},arpeggioLen:{value:0,writable:!0},arpeggioDelay:{value:0,
writable:!0},arpeggioSpeed:{value:0,writable:!0},vibrato:{value:0,writable:!0},vibratoLen:{value:0,writable:!0},vibratoDelay:{value:0,writable:!0},vibratoSpeed:{value:0,writable:!0},pitchBend:{value:0,writable:!0},pitchBendDelay:{value:0,writable:!0},attackMax:{value:0,writable:!0},attackSpeed:{value:0,writable:!0},decayMin:{value:0,writable:!0},decaySpeed:{value:0,writable:!0},sustain:{value:0,writable:!0},releaseMin:{value:0,writable:!0},releaseSpeed:{value:0,writable:!0}})}var l=[0,5760,5424,5120,
4832,4560,4304,4064,3840,3616,3424,3232,3048,2880,2712,2560,2416,2280,2152,2032,1920,1808,1712,1616,1524,1440,1356,1280,1208,1140,1076,1016,960,904,856,808,762,720,678,640,604,570,538,508,480,453,428,404,381,360,339,320,302,285,269,254,240,226,214,202,190,180,170,160,151,143,135,127,120,113,107,101,95];window.neoart.S2Player=function(i){i=AmigaPlayer(i);Object.defineProperties(i,{id:{value:"S2Player"},tracks:{value:[],writable:!0},patterns:{value:[],writable:!0},instruments:{value:[],writable:!0},
samples:{value:[],writable:!0},arpeggios:{value:null,writable:!0},vibratos:{value:null,writable:!0},waves:{value:null,writable:!0},length:{value:0,writable:!0},speedDef:{value:0,writable:!0},voices:{value:[],writable:!0},trackPos:{value:0,writable:!0},patternPos:{value:0,writable:!0},patternLen:{value:0,writable:!0},arpeggioFx:{value:null,writable:!0},arpeggioPos:{value:0,writable:!0},initialize:{value:function(){var b=this.voices[0];this.reset();this.tick=this.speed=this.speedDef;this.patternPos=
this.trackPos=0;for(this.patternLen=64;b;)b.initialize(),b.channel=this.mixer.channels[b.index],b.instr=this.instruments[0],this.arpeggioFx[b.index]=0,b=b.next}},loader:{value:function(b){var e=0,d=0,c,g,a,i=0,h,f,j;b.position=58;if("SIDMON II - THE MIDI VERSION"==b.readString(28)){b.position=2;this.length=b.readUbyte();this.speedDef=b.readUbyte();this.samples.length=b.readUshort()>>6;b.position=14;a=b.readUint();this.tracks.length=a;for(b.position=90;d<a;++d)c=AmigaStep(),Object.defineProperties(c,
{soundTranspose:{value:0,writable:!0}}),c=Object.seal(c),c.pattern=b.readUbyte(),c.pattern>e&&(e=c.pattern),this.tracks[d]=c;for(d=0;d<a;++d)c=this.tracks[d],c.transpose=b.readByte();for(d=0;d<a;++d)c=this.tracks[d],c.soundTranspose=b.readByte();c=b.position;b.position=26;a=b.readUint()>>5;this.instruments.length=++a;b.position=c;this.instruments[0]=m();for(d=0;++d<a;)c=m(),c.wave=b.readUbyte()<<4,c.waveLen=b.readUbyte(),c.waveSpeed=b.readUbyte(),c.waveDelay=b.readUbyte(),c.arpeggio=b.readUbyte()<<
4,c.arpeggioLen=b.readUbyte(),c.arpeggioSpeed=b.readUbyte(),c.arpeggioDelay=b.readUbyte(),c.vibrato=b.readUbyte()<<4,c.vibratoLen=b.readUbyte(),c.vibratoSpeed=b.readUbyte(),c.vibratoDelay=b.readUbyte(),c.pitchBend=b.readByte(),c.pitchBendDelay=b.readUbyte(),b.readByte(),b.readByte(),c.attackMax=b.readUbyte(),c.attackSpeed=b.readUbyte(),c.decayMin=b.readUbyte(),c.decaySpeed=b.readUbyte(),c.sustain=b.readUbyte(),c.releaseMin=b.readUbyte(),c.releaseSpeed=b.readUbyte(),this.instruments[d]=c,b.position+=
9;c=b.position;b.position=30;a=b.readUint();this.waves=new Uint8Array(a);b.position=c;for(d=0;d<a;++d)this.waves[d]=b.readUbyte();c=b.position;b.position=34;a=b.readUint();this.arpeggios=new Int8Array(a);b.position=c;for(d=0;d<a;++d)this.arpeggios[d]=b.readByte();c=b.position;b.position=38;a=b.readUint();this.vibratos=new Int8Array(a);b.position=c;for(d=0;d<a;++d)this.vibratos[d]=b.readByte();a=this.samples.length;for(d=c=0;d<a;++d)f=AmigaSample(),Object.defineProperties(f,{negStart:{value:0,writable:!0},
negLen:{value:0,writable:!0},negSpeed:{value:0,writable:!0},negDir:{value:0,writable:!0},negOffset:{value:0,writable:!0},negPos:{value:0,writable:!0},negCtr:{value:0,writable:!0},negToggle:{value:0,writable:!0}}),f=Object.seal(f),b.readUint(),f.length=b.readUshort()<<1,f.loop=b.readUshort()<<1,f.repeat=b.readUshort()<<1,f.negStart=c+(b.readUshort()<<1),f.negLen=b.readUshort()<<1,f.negSpeed=b.readUshort(),f.negDir=b.readUshort(),f.negOffset=b.readShort(),f.negPos=b.readUint(),f.negCtr=b.readUshort(),
b.position+=6,f.name=b.readString(32),f.pointer=c,f.loopPtr=c+f.loop,c+=f.length,this.samples[d]=f;f=c;a=++e;e=new Uint16Array(++e);for(d=0;d<a;++d)e[d]=b.readUshort();c=b.position;b.position=50;a=b.readUint();this.patterns=[];b.position=c;g=1;for(d=0;d<a;++d)h=AmigaRow(),Object.defineProperties(h,{speed:{value:0,writable:!0}}),h=Object.seal(h),(j=b.readByte())?0>j?h.speed=~j:112>j?(h.note=j,j=b.readByte(),d++,0>j?h.speed=~j:112>j?(h.sample=j,j=b.readByte(),d++,0>j?h.speed=~j:(h.effect=j,h.param=
b.readUbyte(),d++)):(h.effect=j,h.param=b.readUbyte(),d++)):(h.effect=j,h.param=b.readUbyte(),d++):(h.effect=b.readByte(),h.param=b.readUbyte(),d+=2),this.patterns[i++]=h,c+e[g]==b.position&&(e[g++]=i);e[g]=this.patterns.length;0!=(b.position&1)&&b.position++;this.mixer.store(b,f);a=this.tracks.length;for(d=0;d<a;++d)c=this.tracks[d],c.pattern=e[c.pattern];this.length++;this.version=2}}},process:{value:function(){var b,e,d,c,g,a=this.voices[0];this.arpeggioPos=++this.arpeggioPos&3;if(++this.tick>=
this.speed){for(this.tick=0;a;)b=a.channel,a.enabled=a.note=0,this.patternPos||(a.step=this.tracks[this.trackPos+a.index*this.length],a.pattern=a.step.pattern,a.speed=0),0>--a.speed&&(a.row=d=this.patterns[a.pattern++],a.speed=d.speed,d.note&&(a.enabled=1,a.note=d.note+a.step.transpose,b.enabled=0)),a.pitchBend=0,a.note&&(a.waveCtr=a.sustainCtr=0,a.arpeggioCtr=a.arpeggioPos=0,a.vibratoCtr=a.vibratoPos=0,a.pitchBendCtr=a.noteSlideSpeed=0,a.adsrPos=4,a.volume=0,d.sample&&(a.instrument=d.sample,a.instr=
this.instruments[a.instrument+a.step.soundTranspose],a.sample=this.samples[this.waves[a.instr.wave]]),a.original=a.note+this.arpeggios[a.instr.arpeggio],b.period=a.period=l[a.original],c=a.sample,b.pointer=c.pointer,b.length=c.length,b.enabled=a.enabled,b.pointer=c.loopPtr,b.length=c.repeat),a=a.next;++this.patternPos==this.patternLen&&(this.patternPos=0,++this.trackPos==this.length&&(this.trackPos=0,this.mixer.complete=1))}for(a=this.voices[0];a;){if(a.sample&&(c=a.sample,!c.negToggle))if(c.negToggle=
1,c.negCtr)c.negCtr=--c.negCtr&31;else{c.negCtr=c.negSpeed;if(!c.negDir){a=a.next;continue}g=c.negStart=c.negPos;this.mixer.memory[g]=~this.mixer.memory[g];c.negPos+=c.negOffset;g=c.negLen-1;0>c.negPos?2==c.negDir?c.negPos=g:(c.negOffset=~c.negOffset+1,c.negPos+=c.negOffset):g<c.negPos&&(1==c.negDir?c.negPos=0:(c.negOffset=~c.negOffset+1,c.negPos+=c.negOffset))}a=a.next}for(a=this.voices[0];a;)a.sample&&(a.sample.negToggle=0),a=a.next;for(a=this.voices[0];a;){b=a.channel;e=a.instr;switch(a.adsrPos){case 4:a.volume+=
e.attackSpeed;e.attackMax<=a.volume&&(a.volume=e.attackMax,a.adsrPos--);break;case 3:e.decaySpeed?(a.volume-=e.decaySpeed,e.decayMin>=a.volume&&(a.volume=e.decayMin,a.adsrPos--)):a.adsrPos--;break;case 2:a.sustainCtr==e.sustain?a.adsrPos--:a.sustainCtr--;break;case 1:a.volume-=e.releaseSpeed,e.releaseMin>=a.volume&&(a.volume=e.releaseMin,a.adsrPos--)}b.volume=a.volume>>2;e.waveLen&&(a.waveCtr==e.waveDelay?(a.waveCtr=e.waveDelay-e.waveSpeed,a.wavePos==e.waveLen?a.wavePos=0:a.wavePos++,a.sample=c=this.samples[this.waves[e.wave+
a.wavePos]],b.pointer=c.pointer,b.length=c.length):a.waveCtr++);e.arpeggioLen&&(a.arpeggioCtr==e.arpeggioDelay?(a.arpeggioCtr=e.arpeggioDelay-e.arpeggioSpeed,a.arpeggioPos==e.arpeggioLen?a.arpeggioPos=0:a.arpeggioPos++,g=a.original+this.arpeggios[e.arpeggio+a.arpeggioPos],a.period=l[g]):a.arpeggioCtr++);d=a.row;if(this.tick)switch(d.effect){case 112:this.arpeggioFx[0]=d.param>>4;this.arpeggioFx[2]=d.param&15;g=a.original+this.arpeggioFx[this.arpeggioPos];a.period=l[g];break;case 113:a.pitchBend=
~d.param+1;break;case 114:a.pitchBend=d.param;break;case 115:if(0!=a.adsrPos)break;0!=a.instrument&&(a.volume=e.attackMax);a.volume+=d.param<<2;256<=a.volume&&(a.volume=-1);break;case 116:if(0!=a.adsrPos)break;0!=a.instrument&&(a.volume=e.attackMax);a.volume-=d.param<<2;0>a.volume&&(a.volume=0)}switch(d.effect){case 117:e.attackMax=d.param;e.attackSpeed=d.param;break;case 118:this.patternLen=d.param;break;case 124:b.volume=d.param;a.volume=d.param<<2;255<=a.volume&&(a.volume=255);break;case 127:if(g=
d.param&15)this.speed=g}e.vibratoLen&&(a.vibratoCtr==e.vibratoDelay?(a.vibratoCtr=e.vibratoDelay-e.vibratoSpeed,a.vibratoPos==e.vibratoLen?a.vibratoPos=0:a.vibratoPos++,a.period+=this.vibratos[e.vibrato+a.vibratoPos]):a.vibratoCtr++);e.pitchBend&&(a.pitchBendCtr==e.pitchBendDelay?a.pitchBend+=e.pitchBend:a.pitchBendCtr++);d.param&&d.effect&&112>d.effect&&(a.noteSlideTo=l[d.effect+a.step.transpose],g=d.param,0>a.noteSlideTo-a.period&&(g=~g+1),a.noteSlideSpeed=g);if(a.noteSlideTo&&a.noteSlideSpeed&&
(a.period+=a.noteSlideSpeed,0>a.noteSlideSpeed&&a.period<a.noteSlideTo||0<a.noteSlideSpeed&&a.period>a.noteSlideTo))a.noteSlideSpeed=0,a.period=a.noteSlideTo;a.period+=a.pitchBend;95>a.period?a.period=95:5760<a.period&&(a.period=5760);b.period=a.period;a=a.next}}}});i.voices[0]=k(0);i.voices[0].next=i.voices[1]=k(1);i.voices[1].next=i.voices[2]=k(2);i.voices[2].next=i.voices[3]=k(3);i.arpeggioFx=new Uint8Array(4);return Object.seal(i)}})();
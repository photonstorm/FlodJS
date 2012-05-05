/*
  Flod JS 2.1
  2012/04/30
  Christian Corti
  Neoart Costa Rica

  Last Update: Flod JS 2.1 - 2012/04/14

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
  OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
  LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR
  IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

  This work is licensed under the Creative Commons Attribution-Noncommercial-Share Alike 3.0 Unported License.
  To view a copy of this license, visit http://creativecommons.org/licenses/by-nc-sa/3.0/ or send a letter to
  Creative Commons, 171 Second Street, Suite 300, San Francisco, California, 94105, USA.
*/
(function(){function i(g){return Object.create(null,{index:{value:g,writable:!0},next:{value:null,writable:!0},channel:{value:null,writable:!0},sample:{value:null,writable:!0},enabled:{value:0,writable:!0},period:{value:0,writable:!0},effect:{value:0,writable:!0},param:{value:0,writable:!0},volume:{value:0,writable:!0},last:{value:0,writable:!0},slideCtr:{value:0,writable:!0},slideDir:{value:0,writable:!0},slideParam:{value:0,writable:!0},slidePeriod:{value:0,writable:!0},slideSpeed:{value:0,writable:!0},
stepPeriod:{value:0,writable:!0},stepSpeed:{value:0,writable:!0},stepWanted:{value:0,writable:!0},initialize:{value:function(){this.sample=this.channel=null;this.stepWanted=this.stepSpeed=this.stepPeriod=this.slideSpeed=this.slidePeriod=this.slideParam=this.slideDir=this.slideCtr=this.last=this.volume=this.param=this.effect=this.period=this.enabled=0}}})}var j=[1076,1016,960,906,856,808,762,720,678,640,604,570,538,508,480,453,428,404,381,360,339,320,302,285,269,254,240,226,214,202,190,180,170,160,
151,143,135,127,120,113,113,113,113,113,113,113,113,113,113,113,113,113,113,113,113,113,113,113,113,113,113,113,113,113,113,113,-1];window.neoart.FXPlayer=function(g){g=AmigaPlayer(g);Object.defineProperties(g,{id:{value:"FXPlayer"},standard:{value:0,writable:!0},track:{value:null,writable:!0},patterns:{value:[],writable:!0},samples:{value:[],writable:!0},length:{value:0,writable:!0},voices:{value:[],writable:!0},trackPos:{value:0,writable:!0},patternPos:{value:0,writable:!0},jumpFlag:{value:0,writable:!0},
delphine:{value:0,writable:!0},force:{set:function(b){1>b?b=1:4<b&&(b=4);this.version=b}},ntsc:{set:function(b){this.standard=b;this.frequency(b);b=(b?20.44952532:20.637767904)*(this.sampleRate/1E3)/120;this.mixer.samplesTick=this.tempo/122*b>>0}},initialize:{value:function(){var b=this.voices[0];this.reset();this.ntsc=this.standard;this.speed=6;for(this.jumpFlag=this.patternPos=this.trackPos=0;b;)b.initialize(),b.channel=this.mixer.channels[b.index],b.sample=this.samples[0],b=b.next}},loader:{value:function(b){var d=
0,c,a,e,f,g=0,h;if(!(1686>b.length)){b.position=60;c=b.readString(4);if("SONG"!=c){b.position=124;c=b.readString(4);if("SO31"!=c||2350>b.length)return;e=544;this.samples.length=a=32;this.version=4}else e=0,this.samples.length=a=16,this.version=1;this.tempo=b.readUshort();b.position=0;for(c=1;c<a;++c)(h=b.readUint())?(f=AmigaSample(),f.pointer=g,g+=h,this.samples[c]=f):this.samples[c]=null;b.position+=20;for(c=1;c<a;++c)(f=this.samples[c])?(f.name=b.readString(22),f.length=b.readUshort()<<1,f.volume=
b.readUshort(),f.loop=b.readUshort(),f.repeat=b.readUshort()<<1):b.position+=30;b.position=530+e;this.length=a=b.readUbyte();b.position++;for(c=0;c<a;++c)h=b.readUbyte()<<8,this.track[c]=h,h>d&&(d=h);e&&(e+=4);b.position=660+e;d+=256;this.patterns.length=d;a=this.samples.length;for(c=0;c<d;++c){e=AmigaRow();e.note=b.readShort();h=b.readUbyte();e.param=b.readUbyte();e.effect=h&15;e.sample=h>>4;this.patterns[c]=e;if(4==this.version)e.note&4096&&(e.sample+=16,0<e.note&&(e.note&=61439));else{if(9==e.effect||
856<e.note)this.version=2;-3>e.note&&(this.version=3)}if(e.sample>=a||null==this.samples[e.sample])e.sample=0}this.mixer.store(b,g);for(c=1;c<a;++c)if(f=this.samples[c]){f.loop?f.loopPtr=f.pointer+f.loop:(f.loopPtr=this.mixer.memory.length,f.repeat=2);g=f.pointer+4;for(d=f.pointer;d<g;++d)this.mixer.memory[d]=0}f=AmigaSample();f.pointer=f.loopPtr=this.mixer.memory.length;f.length=f.repeat=2;this.samples[0]=f;for(c=b.position=d=this.delphine=0;265>c;++c)d+=b.readUshort();switch(d){case 172662:case 1391423:case 1458300:case 1706977:case 1920077:case 1920694:case 1677853:case 1931956:case 1926836:case 1385071:case 1720635:case 1714491:case 1731874:case 1437490:this.delphine=
1}}}},process:{value:function(){var b,d,c,a=this.voices[0];if(this.tick)for(;a;){b=a.channel;if(!(2==this.version&&-3==a.period))if(a.stepSpeed)a.stepPeriod+=a.stepSpeed,0>a.stepSpeed?a.stepPeriod<a.stepWanted&&(a.stepPeriod=a.stepWanted,2<this.version&&(a.stepSpeed=0)):a.stepPeriod>a.stepWanted&&(a.stepPeriod=a.stepWanted,2<this.version&&(a.stepSpeed=0)),2<this.version&&(a.last=a.stepPeriod),b.period=a.stepPeriod;else{if(a.slideSpeed&&(c=a.slideParam&15))if(++a.slideCtr==c)a.slideCtr=0,c=a.slideParam<<
4<<3,a.slideDir?(a.slidePeriod-=8,b.period=a.slidePeriod,c-=a.slideSpeed,c==a.slidePeriod&&(a.slideDir=0)):(a.slidePeriod+=8,b.period=a.slidePeriod,c+=a.slideSpeed,c==a.slidePeriod&&(a.slideDir=1));else{a=a.next;continue}c=0;switch(a.effect){case 1:c=this.tick%3;d=0;if(2==c){b.period=a.last;a=a.next;continue}for(c=1==c?a.param&15:a.param>>4;a.last!=j[d];)d++;b.period=j[d+c];break;case 2:c=a.param>>4;a.period=c?a.period+c:a.period-(a.param&15);b.period=a.period;break;case 3:this.mixer.filter.active=
1;break;case 4:this.mixer.filter.active=0;break;case 8:c=-1;case 7:a.stepSpeed=a.param&15;a.stepPeriod=2<this.version?a.last:a.period;0>c&&(a.stepSpeed=-a.stepSpeed);for(d=0;;){b=j[d];if(b==a.stepPeriod)break;if(0>b){d=-1;break}else d++}-1<d?(b=a.param>>4,-1<c&&(b=-b),d+=b,0>d&&(d=0),a.stepWanted=j[d]):a.stepWanted=a.period;break;case 9:a.slideSpeed=a.slidePeriod=a.period,a.slideParam=a.param,a.slideDir=0,a.slideCtr=0}}a=a.next}else for(c=this.track[this.trackPos]+this.patternPos;a;){b=a.channel;
a.enabled=0;d=this.patterns[c+a.index];a.period=d.note;a.effect=d.effect;a.param=d.param;if(-3==d.note)a.effect=0;else if(d.sample?(d=a.sample=this.samples[d.sample],a.volume=d.volume,5==a.effect?a.volume+=a.param:6==a.effect&&(a.volume-=a.param),b.volume=a.volume):d=a.sample,a.period){a.last=a.period;a.slideSpeed=0;a.stepSpeed=0;a.enabled=1;b.enabled=0;switch(a.period){case -2:b.volume=0;break;case -4:this.jumpFlag=1;break;case -5:break;default:b.pointer=d.pointer,b.length=d.length,b.period=this.delphine?
a.period<<1:a.period}a.enabled&&(b.enabled=1);b.pointer=d.loopPtr;b.length=d.repeat}a=a.next}if(++this.tick==this.speed&&(this.tick=0,this.patternPos+=4,256==this.patternPos||this.jumpFlag))this.patternPos=this.jumpFlag=0,++this.trackPos==this.length&&(this.trackPos=0,this.mixer.complete=1)}}});g.voices[0]=i(0);g.voices[0].next=g.voices[1]=i(1);g.voices[1].next=g.voices[2]=i(2);g.voices[2].next=g.voices[3]=i(3);g.track=new Uint16Array(128);return Object.seal(g)}})();
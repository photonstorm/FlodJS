/*
  Flod JS 2.1
  2012/04/30
  Christian Corti
  Neoart Costa Rica

  Last Update: Flod JS 2.0 - 2012/03/15

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
  OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
  LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR
  IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

  This work is licensed under the Creative Commons Attribution-Noncommercial-Share Alike 3.0 Unported License.
  To view a copy of this license, visit http://creativecommons.org/licenses/by-nc-sa/3.0/ or send a letter to
  Creative Commons, 171 Second Street, Suite 300, San Francisco, California, 94105, USA.
*/
(function(){function j(h){return Object.create(null,{index:{value:h,writable:!0},next:{value:null,writable:!0},channel:{value:null,writable:!0},sample:{value:null,writable:!0},enabled:{value:0,writable:!0},pattern:{value:0,writable:!0},soundTranspose:{value:0,writable:!0},transpose:{value:0,writable:!0},patStep:{value:0,writable:!0},frqStep:{value:0,writable:!0},frqPos:{value:0,writable:!0},frqSustain:{value:0,writable:!0},frqTranspose:{value:0,writable:!0},volStep:{value:0,writable:!0},volPos:{value:0,
writable:!0},volCtr:{value:0,writable:!0},volSpeed:{value:0,writable:!0},volSustain:{value:0,writable:!0},note:{value:0,writable:!0},pitch:{value:0,writable:!0},volume:{value:0,writable:!0},pitchBendFlag:{value:0,writable:!0},pitchBendSpeed:{value:0,writable:!0},pitchBendTime:{value:0,writable:!0},portamentoFlag:{value:0,writable:!0},portamento:{value:0,writable:!0},volBendFlag:{value:0,writable:!0},volBendSpeed:{value:0,writable:!0},volBendTime:{value:0,writable:!0},vibratoFlag:{value:0,writable:!0},
vibratoSpeed:{value:0,writable:!0},vibratoDepth:{value:0,writable:!0},vibratoDelay:{value:0,writable:!0},vibrato:{value:0,writable:!0},initialize:{value:function(){this.sample=null;this.volPos=this.volStep=this.frqTranspose=this.frqSustain=this.frqPos=this.frqStep=this.patStep=this.transpose=this.soundTranspose=this.pattern=this.enabled=0;this.volSpeed=this.volCtr=1;this.vibrato=this.vibratoDelay=this.vibratoDepth=this.vibratoSpeed=this.vibratoFlag=this.volBendTime=this.volBendSpeed=this.volBendFlag=
this.portamento=this.portamentoFlag=this.pitchBendTime=this.pitchBendSpeed=this.pitchBendFlag=this.volume=this.pitch=this.note=this.volSustain=0}},volumeBend:{value:function(){if(this.volBendFlag^=1)if(this.volBendTime--,this.volume+=this.volBendSpeed,0>this.volume||64<this.volume)this.volBendTime=0}}})}var l=[1712,1616,1524,1440,1356,1280,1208,1140,1076,1016,960,906,856,808,762,720,678,640,604,570,538,508,480,453,428,404,381,360,339,320,302,285,269,254,240,226,214,202,190,180,170,160,151,143,135,
127,120,113,113,113,113,113,113,113,113,113,113,113,113,113,3424,3232,3048,2880,2712,2560,2416,2280,2152,2032,1920,1812,1712,1616,1524,1440,1356,1280,1208,1140,1076,1016,960,906,856,808,762,720,678,640,604,570,538,508,480,453,428,404,381,360,339,320,302,285,269,254,240,226,214,202,190,180,170,160,151,143,135,127,120,113,113,113,113,113,113,113,113,113,113,113,113,113],k=[16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,8,8,8,8,8,8,8,8,16,8,16,16,8,8,
24,-64,-64,-48,-40,-32,-24,-16,-8,0,-8,-16,-24,-32,-40,-48,-56,63,55,47,39,31,23,15,7,-1,7,15,23,31,39,47,55,-64,-64,-48,-40,-32,-24,-16,-8,0,-8,-16,-24,-32,-40,-48,-56,-64,55,47,39,31,23,15,7,-1,7,15,23,31,39,47,55,-64,-64,-48,-40,-32,-24,-16,-8,0,-8,-16,-24,-32,-40,-48,-56,-64,-72,47,39,31,23,15,7,-1,7,15,23,31,39,47,55,-64,-64,-48,-40,-32,-24,-16,-8,0,-8,-16,-24,-32,-40,-48,-56,-64,-72,-80,39,31,23,15,7,-1,7,15,23,31,39,47,55,-64,-64,-48,-40,-32,-24,-16,-8,0,-8,-16,-24,-32,-40,-48,-56,-64,-72,
-80,-88,31,23,15,7,-1,7,15,23,31,39,47,55,-64,-64,-48,-40,-32,-24,-16,-8,0,-8,-16,-24,-32,-40,-48,-56,-64,-72,-80,-88,-96,23,15,7,-1,7,15,23,31,39,47,55,-64,-64,-48,-40,-32,-24,-16,-8,0,-8,-16,-24,-32,-40,-48,-56,-64,-72,-80,-88,-96,-104,15,7,-1,7,15,23,31,39,47,55,-64,-64,-48,-40,-32,-24,-16,-8,0,-8,-16,-24,-32,-40,-48,-56,-64,-72,-80,-88,-96,-104,-112,7,-1,7,15,23,31,39,47,55,-64,-64,-48,-40,-32,-24,-16,-8,0,-8,-16,-24,-32,-40,-48,-56,-64,-72,-80,-88,-96,-104,-112,-120,-1,7,15,23,31,39,47,55,-64,
-64,-48,-40,-32,-24,-16,-8,0,-8,-16,-24,-32,-40,-48,-56,-64,-72,-80,-88,-96,-104,-112,-120,-128,7,15,23,31,39,47,55,-64,-64,-48,-40,-32,-24,-16,-8,0,-8,-16,-24,-32,-40,-48,-56,-64,-72,-80,-88,-96,-104,-112,-120,-128,-120,15,23,31,39,47,55,-64,-64,-48,-40,-32,-24,-16,-8,0,-8,-16,-24,-32,-40,-48,-56,-64,-72,-80,-88,-96,-104,-112,-120,-128,-120,-112,23,31,39,47,55,-64,-64,-48,-40,-32,-24,-16,-8,0,-8,-16,-24,-32,-40,-48,-56,-64,-72,-80,-88,-96,-104,-112,-120,-128,-120,-112,-104,31,39,47,55,-64,-64,-48,
-40,-32,-24,-16,-8,0,-8,-16,-24,-32,-40,-48,-56,-64,-72,-80,-88,-96,-104,-112,-120,-128,-120,-112,-104,-96,39,47,55,-64,-64,-48,-40,-32,-24,-16,-8,0,-8,-16,-24,-32,-40,-48,-56,-64,-72,-80,-88,-96,-104,-112,-120,-128,-120,-112,-104,-96,-88,47,55,-64,-64,-48,-40,-32,-24,-16,-8,0,-8,-16,-24,-32,-40,-48,-56,-64,-72,-80,-88,-96,-104,-112,-120,-128,-120,-112,-104,-96,-88,-80,55,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,127,127,127,127,127,127,127,127,127,127,127,127,
127,127,127,127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,127,127,127,127,127,127,127,127,127,127,127,127,127,127,127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,127,127,127,127,127,127,127,127,127,127,127,127,127,127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,127,127,127,127,127,127,127,127,127,127,127,127,127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,
-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,127,127,127,127,127,127,127,127,127,127,127,127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,127,127,127,127,127,127,127,127,127,127,127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,127,127,127,127,127,127,127,127,127,127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,
-127,-127,127,127,127,127,127,127,127,127,127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,127,127,127,127,127,127,127,127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,127,127,127,127,127,127,127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,127,127,127,127,127,
127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,127,127,127,127,127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,127,127,127,127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,127,127,127,-128,-128,-128,-128,-128,-128,
-128,-128,-128,-128,-128,-128,-128,-128,-128,-128,-128,-128,-128,-128,-128,-128,-128,-128,-128,-128,-128,-128,-128,-128,127,127,-128,-128,-128,-128,-128,-128,-128,-128,-128,-128,-128,-128,-128,-128,-128,-128,-128,-128,-128,-128,-128,-128,-128,-128,-128,-128,-128,-128,-128,-128,-128,127,-128,-128,-128,-128,-128,-128,-128,-128,127,127,127,127,127,127,127,127,-128,-128,-128,-128,-128,-128,-128,127,127,127,127,127,127,127,127,127,-128,-128,-128,-128,-128,-128,127,127,127,127,127,127,127,127,127,127,-128,
-128,-128,-128,-128,127,127,127,127,127,127,127,127,127,127,127,-128,-128,-128,-128,127,127,127,127,127,127,127,127,127,127,127,127,-128,-128,-128,127,127,127,127,127,127,127,127,127,127,127,127,127,-128,-128,127,127,127,127,127,127,127,127,127,127,127,127,127,127,-128,-128,127,127,127,127,127,127,127,127,127,127,127,127,127,127,-128,-128,-112,-104,-96,-88,-80,-72,-64,-56,-48,-40,-32,-24,-16,-8,0,8,16,24,32,40,48,56,64,72,80,88,96,104,112,127,-128,-128,-96,-80,-64,-48,-32,-16,0,16,32,48,64,80,96,
112,69,69,121,125,122,119,112,102,97,88,83,77,44,32,24,18,4,-37,-45,-51,-58,-68,-75,-82,-88,-93,-99,-103,-109,-114,-117,-118,69,69,121,125,122,119,112,102,91,75,67,55,44,32,24,18,4,-8,-24,-37,-49,-58,-66,-80,-88,-92,-98,-102,-107,-108,-115,-125,0,0,64,96,127,96,64,32,0,-32,-64,-96,-128,-96,-64,-32,0,0,64,96,127,96,64,32,0,-32,-64,-96,-128,-96,-64,-32,-128,-128,-112,-104,-96,-88,-80,-72,-64,-56,-48,-40,-32,-24,-16,-8,0,8,16,24,32,40,48,56,64,72,80,88,96,104,112,127,-128,-128,-96,-80,-64,-48,-32,-16,
0,16,32,48,64,80,96,112];window.neoart.FCPlayer=function(h){h=AmigaPlayer(h);Object.defineProperties(h,{id:{value:"FCPlayer"},seqs:{value:null,writable:!0},pats:{value:null,writable:!0},vols:{value:null,writable:!0},frqs:{value:null,writable:!0},length:{value:0,writable:!0},samples:{value:[],writable:!0},voices:{value:[],writable:!0},initialize:{value:function(){var b=this.voices[0];this.reset();this.seqs.position=0;this.pats.position=0;this.vols.position=0;for(this.frqs.position=0;b;)b.initialize(),
b.channel=this.mixer.channels[b.index],b.pattern=this.seqs.readUbyte()<<6,b.transpose=this.seqs.readByte(),b.soundTranspose=this.seqs.readByte(),b=b.next;this.speed=this.seqs.readUbyte();this.speed||(this.speed=3);this.tick=this.speed}},loader:{value:function(b){var g,d,e,f,a,c,i,h,j;d=b.readString(4);if("SMOD"==d)this.version=1;else if("FC14"==d)this.version=2;else return;b.position=4;this.length=b.readUint();b.position=1==this.version?100:180;this.seqs=ByteArray(new ArrayBuffer(this.length));b.readBytes(this.seqs,
0,this.length);this.length=this.length/13>>0;b.position=12;e=b.readUint();b.position=8;b.position=b.readUint();this.pats=ByteArray(new ArrayBuffer(e+1));b.readBytes(this.pats,0,e);b.position=20;e=b.readUint();b.position=16;b.position=b.readUint();this.frqs=ByteArray(new ArrayBuffer(e+9));this.frqs.writeInt(16777216);this.frqs.writeInt(225);b.readBytes(this.frqs,8,e);this.frqs.position=this.frqs.length-1;this.frqs.writeByte(225);this.frqs.position=0;b.position=28;e=b.readUint();b.position=24;b.position=
b.readUint();this.vols=ByteArray(new ArrayBuffer(e+8));this.vols.writeInt(16777216);this.vols.writeInt(225);b.readBytes(this.vols,8,e);b.position=32;i=b.readUint();b.position=40;1==this.version?(this.samples.length=57,f=0):(this.samples.length=200,f=2);for(g=0;10>g;++g)if(e=b.readUshort()<<1,0<e)if(a=b.position,b.position=i,d=b.readString(4),"SSMP"==d){h=e;for(d=0;10>d;++d)(b.readInt(),e=b.readUshort()<<1,0<e)?(c=AmigaSample(),c.length=e+2,c.loop=b.readUshort(),c.repeat=b.readUshort()<<1,c.loop+c.repeat>
c.length&&(c.repeat=c.length-c.loop),i+c.length>b.length&&(c.length=b.length-i),c.pointer=this.mixer.store(b,c.length,i+j),c.loopPtr=c.pointer+c.loop,this.samples[100+10*g+d]=c,j+=c.length,b.position+=6):b.position+=10;i+=h+2;b.position=a+4}else b.position=a,c=AmigaSample(),c.length=e+f,c.loop=b.readUshort(),c.repeat=b.readUshort()<<1,c.loop+c.repeat>c.length&&(c.repeat=c.length-c.loop),i+c.length>b.length&&(c.length=b.length-i),c.pointer=this.mixer.store(b,c.length,i),c.loopPtr=c.pointer+c.loop,
this.samples[g]=c,i+=c.length;else b.position+=4;if(1==this.version){f=0;h=47;for(g=10;57>g;++g){c=AmigaSample();c.length=k[f++]<<1;c.loop=0;c.repeat=c.length;a=this.mixer.memory.length;c.pointer=a;c.loopPtr=a;this.samples[g]=c;e=a+c.length;for(d=a;d<e;++d)this.mixer.memory[d]=k[h++]}}else{b.position=36;i=b.readUint();b.position=100;for(g=10;90>g;++g)e=b.readUbyte()<<1,2>e||(c=AmigaSample(),c.length=e,c.loop=0,c.repeat=c.length,i+c.length>b.length&&(c.length=b.length-i),c.pointer=this.mixer.store(b,
c.length,i),c.loopPtr=c.pointer,this.samples[g]=c,i+=c.length)}this.length*=13}},process:{value:function(){var b,g,d,e,f,a=this.voices[0];if(0==--this.tick){for(b=this.seqs.position;a;){g=a.channel;this.pats.position=a.pattern+a.patStep;f=this.pats.readUbyte();if(64<=a.patStep||73==f)this.seqs.position==this.length&&(this.seqs.position=0,this.mixer.complete=1),a.patStep=0,a.pattern=this.seqs.readUbyte()<<6,a.transpose=this.seqs.readByte(),a.soundTranspose=this.seqs.readByte(),this.pats.position=a.pattern,
f=this.pats.readUbyte();d=this.pats.readUbyte();this.frqs.position=0;this.vols.position=0;0!=f&&(a.note=f&127,a.pitch=0,a.portamento=0,a.enabled=g.enabled=0,f=8+((d&63)+a.soundTranspose<<6),0<=f&&f<this.vols.length&&(this.vols.position=f),a.volStep=0,a.volSpeed=a.volCtr=this.vols.readUbyte(),a.volSustain=0,a.frqPos=8+(this.vols.readUbyte()<<6),a.frqStep=0,a.frqSustain=0,a.vibratoFlag=0,a.vibratoSpeed=this.vols.readUbyte(),a.vibratoDepth=a.vibrato=this.vols.readUbyte(),a.vibratoDelay=this.vols.readUbyte(),
a.volPos=this.vols.position);d&64?a.portamento=0:d&128&&(a.portamento=this.pats[this.pats.position+1],1==this.version&&(a.portamento<<=1));a.patStep+=2;a=a.next}if(this.seqs.position!=b&&(f=this.seqs.readUbyte()))this.speed=f;this.tick=this.speed}for(a=this.voices[0];a;){g=a.channel;do{b=0;if(a.frqSustain){a.frqSustain--;break}this.frqs.position=a.frqPos+a.frqStep;do{e=0;if(!this.frqs.bytesAvailable)break;d=this.frqs.readUbyte();if(225==d)break;224==d&&(a.frqStep=this.frqs.readUbyte()&63,this.frqs.position=
a.frqPos+a.frqStep,d=this.frqs.readUbyte());switch(d){case 226:g.enabled=0,a.enabled=1,a.volCtr=1,a.volStep=0;case 228:(d=this.samples[this.frqs.readUbyte()])?(g.pointer=d.pointer,g.length=d.length):a.enabled=0;a.sample=d;a.frqStep+=2;break;case 233:f=100+10*this.frqs.readUbyte();if(d=this.samples[f+this.frqs.readUbyte()])g.enabled=0,g.pointer=d.pointer,g.length=d.length,a.enabled=1;a.sample=d;a.volCtr=1;a.volStep=0;a.frqStep+=3;break;case 231:e=1;a.frqPos=8+(this.frqs.readUbyte()<<6);a.frqPos>=this.frqs.length&&
(a.frqPos=0);a.frqStep=0;this.frqs.position=a.frqPos;break;case 234:a.pitchBendSpeed=this.frqs.readByte();a.pitchBendTime=this.frqs.readUbyte();a.frqStep+=3;break;case 232:b=1;a.frqSustain=this.frqs.readUbyte();a.frqStep+=2;break;case 227:a.vibratoSpeed=this.frqs.readUbyte(),a.vibratoDepth=this.frqs.readUbyte(),a.frqStep+=3}!b&&!e&&(this.frqs.position=a.frqPos+a.frqStep,a.frqTranspose=this.frqs.readByte(),a.frqStep++)}while(e)}while(b);if(a.volSustain)a.volSustain--;else if(a.volBendTime)a.volumeBend();
else if(0==--a.volCtr){a.volCtr=a.volSpeed;do{e=0;this.vols.position=a.volPos+a.volStep;if(!this.vols.bytesAvailable)break;d=this.vols.readUbyte();if(225==d)break;switch(d){case 234:a.volBendSpeed=this.vols.readByte();a.volBendTime=this.vols.readUbyte();a.volStep+=3;a.volumeBend();break;case 232:a.volSustain=this.vols.readUbyte();a.volStep+=2;break;case 224:e=1;f=this.vols.readUbyte()&63;a.volStep=f-5;break;default:a.volume=d,a.volStep++}}while(e)}d=a.frqTranspose;0<=d&&(d+=a.note+a.transpose);d&=
127;e=l[d];if(a.vibratoDelay)a.vibratoDelay--;else{f=a.vibrato;a.vibratoFlag?(b=a.vibratoDepth<<1,f+=a.vibratoSpeed,f>b&&(f=b,a.vibratoFlag=0)):(f-=a.vibratoSpeed,0>f&&(f=0,a.vibratoFlag=1));a.vibrato=f;f-=a.vibratoDepth;for(b=(d<<1)+160;256>b;)f<<=1,b+=24;e+=f}a.portamentoFlag^=1;a.portamentoFlag&&a.portamento&&(a.pitch=31<a.portamento?a.pitch+(a.portamento&31):a.pitch-a.portamento);a.pitchBendFlag^=1;a.pitchBendFlag&&a.pitchBendTime&&(a.pitchBendTime--,a.pitch-=a.pitchBendSpeed);e+=a.pitch;113>
e?e=113:3424<e&&(e=3424);g.period=e;g.volume=a.volume;a.sample&&(d=a.sample,g.enabled=a.enabled,g.pointer=d.loopPtr,g.length=d.repeat);a=a.next}}}});h.voices[0]=j(0);h.voices[0].next=h.voices[1]=j(1);h.voices[1].next=h.voices[2]=j(2);h.voices[2].next=h.voices[3]=j(3);return Object.seal(h)}})();
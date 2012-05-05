/*
  Flod JS 2.1
  2012/04/30
  Christian Corti
  Neoart Costa Rica

  Last Update: Flod JS 2.0 - 2012/02/12

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
  OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
  LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR
  IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

  This work is licensed under the Creative Commons Attribution-Noncommercial-Share Alike 3.0 Unported License.
  To view a copy of this license, visit http://creativecommons.org/licenses/by-nc-sa/3.0/ or send a letter to
  Creative Commons, 171 Second Street, Suite 300, San Francisco, California, 94105, USA.
*/
(function(){function h(g,a){return Object.create(null,{index:{value:g,writable:!0},bitFlag:{value:a,writable:!0},next:{value:null,writable:!0},channel:{value:null,writable:!0},sample:{value:null,writable:!0},trackPtr:{value:0,writable:!0},trackPos:{value:0,writable:!0},patternPos:{value:0,writable:!0},tick:{value:0,writable:!0},busy:{value:0,writable:!0},flags:{value:0,writable:!0},note:{value:0,writable:!0},period:{value:0,writable:!0},volume:{value:0,writable:!0},portaSpeed:{value:0,writable:!0},
vibratoPtr:{value:0,writable:!0},vibratoPos:{value:0,writable:!0},synthPos:{value:0,writable:!0},initialize:{value:function(){this.sample=this.channel=null;this.patternPos=this.trackPos=this.trackPtr=0;this.busy=this.tick=1;this.synthPos=this.vibratoPos=this.vibratoPtr=this.portaSpeed=this.volume=this.period=this.note=this.flags=0}}})}function j(){var g=AmigaSample();Object.defineProperties(g,{relative:{value:0,writable:!0},divider:{value:0,writable:!0},vibrato:{value:0,writable:!0},hiPos:{value:0,
writable:!0},loPos:{value:0,writable:!0},wave:{value:[],writable:!0}});return Object.seal(g)}window.neoart.RHPlayer=function(g){g=AmigaPlayer(g);Object.defineProperties(g,{id:{value:"RHPlayer"},songs:{value:[],writable:!0},samples:{value:[],writable:!0},song:{value:null,writable:!0},periods:{value:0,writable:!0},vibrato:{value:0,writable:!0},voices:{value:[],writable:!0},stream:{value:null,writable:!0},complete:{value:0,writable:!0},variant:{value:0,writable:!0},initialize:{value:function(){var a,
f,d,e=this.voices[3];this.reset();this.song=this.songs[this.playSong];this.complete=15;for(a=0;a<this.samples.length;++a)if(d=this.samples[a],d.wave.length)for(f=0;f<d.length;++f)this.mixer.memory[d.pointer+f]=d.wave[f];for(;e;)e.initialize(),e.channel=this.mixer.channels[e.index],e.trackPtr=this.song.tracks[e.index],e.trackPos=4,this.stream.position=e.trackPtr,e.patternPos=this.stream.readUint(),e=e.next}},loader:{value:function(a){var f,d,e,b,c,g,i,h;for(a.position=44;1024>a.position;)if(c=a.readUshort(),
32272==c||32288==c)c=a.readUshort(),16890==c&&(f=a.position+a.readUshort(),c=a.readUshort(),53756==c?(g=f+a.readUint(),this.mixer.loopLen=64,a.position+=2):(g=f,this.mixer.loopLen=512),e=a.position+a.readUshort(),c=a.readUbyte(),114==c&&(d=a.readUbyte()));else if(20937==c){if(a.position+=2,c=a.readUshort(),17914==c){h=a.position+a.readUshort();for(a.position+=2;;)if(c=a.readUshort(),19450==c){b=a.position+a.readUshort();break}}}else if(49404==c)a.position+=2,c=a.readUshort(),16875==c&&(i=a.readUshort());
else if(13421==c)a.position+=2,c=a.readUshort(),18938==c&&(this.vibrato=a.position+a.readUshort());else if(16960==c&&(c=a.readUshort(),17914==c)){this.periods=a.position+a.readUshort();break}if(e&&g&&d&&i){a.position=g;this.samples=[];d++;for(f=0;f<d;++f)c=j(),c.length=a.readUint(),c.relative=parseInt(3579545/a.readUshort()),c.pointer=this.mixer.store(a,c.length),this.samples[f]=c;a.position=e;for(f=0;f<d;++f)c=this.samples[f],a.position+=4,c.loopPtr=a.readInt(),a.position+=6,c.volume=a.readUshort(),
b&&(c.divider=a.readUshort(),c.vibrato=a.readUshort(),c.hiPos=a.readUshort(),c.loPos=a.readUshort(),a.position+=8);if(b){a.position=b;f=b-e>>5;e=f+3;this.variant=1;if(f>=d)for(;d<f;++d)this.samples[d]=j();for(;f<e;++f){c=j();a.position+=4;c.loopPtr=a.readInt();c.length=a.readUshort();c.relative=a.readUshort();a.position+=2;c.volume=a.readUshort();c.divider=a.readUshort();c.vibrato=a.readUshort();c.hiPos=a.readUshort();c.loPos=a.readUshort();b=a.position;a.position=h;a.position=a.readInt();c.pointer=
this.mixer.memory.length;this.mixer.memory.length+=c.length;for(d=0;d<c.length;++d)c.wave[d]=a.readByte();this.samples[f]=c;h+=4;a.position=b}}a.position=i;this.songs=[];for(c=65536;;){i=Object.create(null,{speed:{value:0,writable:!0},tracks:{value:null,writable:!0}});a.position++;i.tracks=new Uint32Array(4);i.speed=a.readUbyte();for(f=0;4>f;++f)d=a.readUint(),d<c&&(c=d),i.tracks[f]=d;this.songs.push(i);if(18>c-a.position)break}this.lastSong=this.songs.length-1;a.length=g;for(a.position=352;512>a.position;)c=
a.readUshort(),45116==c&&(c=a.readUshort(),133==c?this.variant=2:134==c?this.variant=4:135==c&&(this.variant=3));this.stream=a;this.version=1}}},process:{value:function(){for(var a,f,d,e,b=this.voices[3];b;){a=b.channel;this.stream.position=b.patternPos;d=b.sample;b.busy||(b.busy=1,0==d.loopPtr?(a.pointer=this.mixer.loopPtr,a.length=this.mixer.loopLen):0<d.loopPtr&&(a.pointer=d.pointer+d.loopPtr,a.length=d.length-d.loopPtr));if(0==--b.tick){b.flags=0;for(f=1;f;)if(e=this.stream.readByte(),0>e)switch(e){case -121:3==
this.variant&&(b.volume=this.stream.readUbyte());break;case -122:4==this.variant&&(b.volume=this.stream.readUbyte());break;case -123:1<this.variant&&(this.mixer.complete=1);break;case -124:this.stream.position=b.trackPtr+b.trackPos;e=this.stream.readUint();b.trackPos+=4;e||(this.stream.position=b.trackPtr,e=this.stream.readUint(),b.trackPos=4,this.loopSong||(this.complete&=~b.bitFlag,this.complete||(this.mixer.complete=1)));this.stream.position=e;break;case -125:4==this.variant&&(b.flags|=4);break;
case -126:b.tick=this.song.speed*this.stream.readByte();b.patternPos=this.stream.position;a.pointer=this.mixer.loopPtr;a.length=this.mixer.loopLen;f=0;break;case -127:b.portaSpeed=this.stream.readByte();b.flags|=1;break;case -128:e=this.stream.readByte(),0>e&&(e=0),b.sample=d=this.samples[e],b.vibratoPtr=this.vibrato+d.vibrato,b.vibratoPos=b.vibratoPtr}else b.tick=this.song.speed*e,b.note=this.stream.readByte(),b.patternPos=this.stream.position,b.synthPos=d.loPos,b.vibratoPos=b.vibratoPtr,a.pointer=
d.pointer,a.length=d.length,a.volume=b.volume?b.volume:d.volume,this.stream.position=this.periods+(b.note<<1),e=this.stream.readUshort()*d.relative,a.period=b.period=e>>10,a.enabled=1,b.busy=f=0}else{if(1==b.tick&&(4!=this.variant||!(b.flags&4)))a.enabled=0;b.flags&1&&(a.period=b.period+=b.portaSpeed);d.divider&&(this.stream.position=b.vibratoPos,e=this.stream.readByte(),-124==e&&(this.stream.position=b.vibratoPtr,e=this.stream.readByte()),b.vibratoPos=this.stream.position,e*=parseInt(b.period/d.divider),
a.period=b.period+e)}d.hiPos&&(e=0,b.flags&2?(b.synthPos--,b.synthPos<=d.loPos&&(b.flags&=-3,e=60)):(b.synthPos++,b.synthPos>d.hiPos&&(b.flags|=2,e=60)),this.mixer.memory[d.pointer+b.synthPos]=e);b=b.next}}}});g.voices[3]=h(3,8);g.voices[3].next=g.voices[2]=h(2,4);g.voices[2].next=g.voices[1]=h(1,2);g.voices[1].next=g.voices[0]=h(0,1);return Object.seal(g)}})();
/*
  Flod JS 2.0
  2012/04/01
  Christian Corti
  Neoart Costa Rica

  Last Update: Flod JS 1.0 - 2012/02/08

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
  OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
  LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR
  IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

  This work is licensed under the Creative Commons Attribution-Noncommercial-Share Alike 3.0 Unported License.
  To view a copy of this license, visit http://creativecommons.org/licenses/by-nc-sa/3.0/ or send a letter to
  Creative Commons, 171 Second Street, Suite 300, San Francisco, California, 94105, USA.
*/
function SBChannel(){return Object.create(null,{next:{value:null,writable:!0},mute:{value:0,writable:!0},enabled:{value:0,writable:!0},sample:{value:null,writable:!0},length:{value:0,writable:!0},index:{value:0,writable:!0},pointer:{value:0,writable:!0},delta:{value:0,writable:!0},fraction:{value:0,writable:!0},speed:{value:0,writable:!0},dir:{value:0,writable:!0},oldSample:{value:null,writable:!0},oldLength:{value:0,writable:!0},oldPointer:{value:0,writable:!0},oldFraction:{value:0,writable:!0},
oldSpeed:{value:0,writable:!0},oldDir:{value:0,writable:!0},volume:{value:0,writable:!0},lvol:{value:0,writable:!0},rvol:{value:0,writable:!0},panning:{value:128,writable:!0},lpan:{value:0.5,writable:!0},rpan:{value:0.5,writable:!0},ldata:{value:0,writable:!0},rdata:{value:0,writable:!0},mixCounter:{value:0,writable:!0},lmixRampU:{value:0,writable:!0},lmixDeltaU:{value:0,writable:!0},rmixRampU:{value:0,writable:!0},rmixDeltaU:{value:0,writable:!0},lmixRampD:{value:0,writable:!0},lmixDeltaD:{value:0,
writable:!0},rmixRampD:{value:0,writable:!0},rmixDeltaD:{value:0,writable:!0},volCounter:{value:0,writable:!0},lvolDelta:{value:0,writable:!0},rvolDelta:{value:0,writable:!0},panCounter:{value:0,writable:!0},lpanDelta:{value:0,writable:!0},rpanDelta:{value:0,writable:!0},initialize:{value:function(){this.enabled=0;this.sample=null;this.dir=this.speed=this.fraction=this.delta=this.pointer=this.index=this.length=0;this.oldSample=null;this.rvol=this.lvol=this.volume=this.oldDir=this.oldSpeed=this.oldFraction=
this.oldPointer=this.oldLength=0;this.panning=128;this.rpan=this.lpan=0.5;this.rpanDelta=this.lpanDelta=this.panCounter=this.rvolDelta=this.lvolDelta=this.volCounter=this.rmixDeltaD=this.rmixRampD=this.lmixDeltaD=this.lmixRampD=this.rmixDeltaU=this.rmixRampU=this.lmixDeltaU=this.lmixRampU=this.mixCounter=this.rdata=this.ldata=0}}})}
function SBSample(){return Object.create(null,{name:{value:"",writable:!0},bits:{value:8,writable:!0},volume:{value:0,writable:!0},length:{value:0,writable:!0},data:{value:[],writable:!0},loopMode:{value:0,writable:!0},loopStart:{value:0,writable:!0},loopLen:{value:0,writable:!0},store:{value:function(d){var b=0,a,g=this.length,f;this.loopLen||(this.loopMode=0);f=d.position;this.loopMode?(g=this.loopStart+this.loopLen,this.data=new Float32Array(g+1)):this.data=new Float32Array(this.length+1);if(8==
this.bits){f+g>d.length&&(g=d.length-f);for(a=0;a<g;a++)b=d.readByte()+b,-128>b?b+=256:127<b&&(b-=256),this.data[a]=0.0078125*b}else{f+(g<<1)>d.length&&(g=d.length-f>>1);for(a=0;a<g;a++)b=d.readShort()+b,-32768>b?b+=65536:32767<b&&(b-=65536),this.data[a]=3.051758E-5*b}b=f+length;this.loopMode?(this.length=this.loopStart+this.loopLen,this.data[g]=1==this.loopMode?this.data[this.loopStart]:this.data[g-1]):this.data[this.length]=0;if(g!=this.length){f=this.data[g-1];for(a=g;a<this.length;a++)this.data[a]=
f}d.position=b<d.length?b:d.length-1}}})}function Soundblaster(){var d=CoreMixer();Object.defineProperties(d,{setup:{value:function(b){var a=1;this.channels.length=b;for(this.channels[0]=SBChannel();a<b;++a)this.channels[a]=this.channels[a-1].next=SBChannel()}},initialize:{value:function(){this.reset()}},fast:{value:function(b){var a,g,f,d=0,k,m=0,l,e,i=this.bufferSize,h,j;if(this.completed){if(!this.remains){this.player.stop();return}i=this.remains}for(;d<i;){this.samplesLeft||(this.player.process(),this.player.fast(),this.samplesLeft=
this.samplesTick,this.completed&&(i=d+this.samplesTick,i>this.bufferSize&&(this.remains=i-this.bufferSize,i=this.bufferSize)));h=this.samplesLeft;d+h>=i&&(h=i-d);k=m+h;for(a=this.channels[0];a;){if(a.enabled){l=a.sample;g=l.data;e=this.buffer[m];for(f=m;f<k;++f){if(a.index!=a.pointer){if(a.index>=a.length)if(l.loopMode)a.pointer=l.loopStart+(a.index-a.length),a.length=l.length,2==l.loopMode&&(a.dir=a.dir?0:l.length+l.loopStart-1);else{a.enabled=0;break}else a.pointer=a.index;a.mute?(a.ldata=0,a.rdata=
0):(j=a.dir?g[a.dir-a.pointer]:g[a.pointer],a.ldata=j*a.lvol,a.rdata=j*a.rvol)}a.index=a.pointer+a.delta;if(1<=(a.fraction+=a.speed))a.index++,a.fraction--;e.l+=a.ldata;e.r+=a.rdata;e=e.next}}a=a.next}m=k;d+=h;this.samplesLeft-=h}e=this.buffer[0];a=b.outputBuffer.getChannelData(0);b=b.outputBuffer.getChannelData(1);for(f=0;f<i;++f)1<e.l?e.l=1:-1>e.l&&(e.l=-1),1<e.r?e.r=1:-1>e.r&&(e.r=-1),a[f]=e.l,b[f]=e.r,e.l=e.r=0,e=e.next}},accurate:{value:function(b){var a,d,f,p,k,m=0,l,e=0,i,h,j,c,o=this.bufferSize,
q,n;if(this.completed){if(!this.remains){this.player.stop();return}o=this.remains}for(;m<o;){this.samplesLeft||(this.player.process(),this.player.accurate(),this.samplesLeft=this.samplesTick,this.completed&&(o=m+this.samplesTick,o>this.bufferSize&&(this.remains=o-this.bufferSize,o=this.bufferSize)));q=this.samplesLeft;m+q>=o&&(q=o-m);l=e+q;for(a=this.channels[0];a;){if(a.enabled){h=a.sample;d=h.data;if(j=a.oldSample)f=j.data;c=this.buffer[e];for(k=e;k<l;++k){n=a.mute?0:d[a.pointer];n+=(d[a.pointer+
a.dir]-n)*a.fraction;if(1<=(a.fraction+=a.speed))p=a.fraction>>0,a.fraction-=p,0<a.dir?(a.pointer+=p,a.pointer>a.length&&(a.fraction+=a.pointer-a.length,a.pointer=a.length)):(a.pointer-=p,a.pointer<a.length&&(a.fraction+=a.length-a.pointer,a.pointer=a.length));if(a.mixCounter){if(j){i=a.mute?0:f[a.oldPointer];i+=(f[a.oldPointer+a.oldDir]-i)*a.oldFraction;if(1<(a.oldFraction+=a.oldSpeed))p=a.oldFraction>>0,a.oldFraction-=p,0<a.oldDir?(a.oldPointer+=p,a.oldPointer>a.oldLength&&(a.oldFraction+=a.oldPointer-
a.oldLength,a.oldPointer=a.oldLength)):(a.oldPointer-=p,a.oldPointer<a.oldLength&&(a.oldFraction+=a.oldLength-a.oldPointer,a.oldPointer=a.oldLength));c.l+=n*a.lmixRampU+i*a.lmixRampD;c.r+=n*a.rmixRampU+i*a.rmixRampD;a.lmixRampD-=a.lmixDeltaD;a.rmixRampD-=a.rmixDeltaD}else c.l+=n*a.lmixRampU,c.r+=n*a.rmixRampU;a.lmixRampU+=a.lmixDeltaU;a.rmixRampU+=a.rmixDeltaU;a.mixCounter--;a.oldPointer==a.oldLength&&(j.loopMode?1==j.loopMode?(a.oldPointer=j.loopStart,a.oldLength=j.length):0<a.oldDir?(a.oldPointer=
j.length-1,a.oldLength=j.loopStart,a.oldDir=-1):(a.oldFraction-=1,a.oldPointer=j.loopStart,a.oldLength=j.length,a.oldDir=1):(j=null,a.oldPointer=0))}else c.l+=n*a.lvol,c.r+=n*a.rvol,a.volCounter?(a.lvol+=a.lvolDelta,a.rvol+=a.rvolDelta,a.volCounter--):a.panCounter&&(a.lpan+=a.lpanDelta,a.rpan+=a.rpanDelta,a.panCounter--,a.lvol=a.volume*a.lpan,a.rvol=a.volume*a.rpan);if(a.pointer==a.length)if(h.loopMode)1==h.loopMode?(a.pointer=h.loopStart,a.length=h.length):0<a.dir?(a.pointer=h.length-1,a.length=
h.loopStart,a.dir=-1):(a.fraction-=1,a.pointer=h.loopStart,a.length=h.length,a.dir=1);else{a.enabled=0;break}c=c.next}}a=a.next}e=l;m+=q;this.samplesLeft-=q}c=this.buffer[0];a=b.outputBuffer.getChannelData(0);b=b.outputBuffer.getChannelData(1);for(k=0;k<o;++k)1<c.l?c.l=1:-1>c.l&&(c.l=-1),1<c.r?c.r=1:-1>c.r&&(c.r=-1),a[k]=c.l,b[k]=c.r,c.l=c.r=0,c=c.next}}});d.bufferSize=8192;return Object.seal(d)}
function SBPlayer(d){var b=CorePlayer();Object.defineProperties(b,{track:{value:null,writable:!0},length:{value:0,writable:!0},restart:{value:0,writable:!0},timer:{value:0,writable:!0},master:{value:0,writable:!0},setup:{configurable:!1,value:function(){this.mixer.setup(this.channels)}}});b.mixer=d||Soundblaster();b.mixer.player=b;b.endian=1;b.quality=1;return b};
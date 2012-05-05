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
  (function() {
    function RHVoice(idx, bit) {
      return Object.create(null, {
        index       : { value:idx,  writable:true },
        bitFlag     : { value:bit,  writable:true },
        next        : { value:null, writable:true },
        channel     : { value:null, writable:true },
        sample      : { value:null, writable:true },
        trackPtr    : { value:0,    writable:true },
        trackPos    : { value:0,    writable:true },
        patternPos  : { value:0,    writable:true },
        tick        : { value:0,    writable:true },
        busy        : { value:0,    writable:true },
        flags       : { value:0,    writable:true },
        note        : { value:0,    writable:true },
        period      : { value:0,    writable:true },
        volume      : { value:0,    writable:true },
        portaSpeed  : { value:0,    writable:true },
        vibratoPtr  : { value:0,    writable:true },
        vibratoPos  : { value:0,    writable:true },
        synthPos    : { value:0,    writable:true },

        initialize: {
          value: function() {
            this.channel     = null;
            this.sample      = null;
            this.trackPtr    = 0;
            this.trackPos    = 0;
            this.patternPos  = 0;
            this.tick        = 1;
            this.busy        = 1;
            this.flags       = 0;
            this.note        = 0;
            this.period      = 0;
            this.volume      = 0;
            this.portaSpeed  = 0;
            this.vibratoPtr  = 0;
            this.vibratoPos  = 0;
            this.synthPos    = 0;
        }}
      });
    }
    function RHSample() {
      var o = AmigaSample();

      Object.defineProperties(o, {
        relative : { value:0,  writable:true },
        divider  : { value:0,  writable:true },
        vibrato  : { value:0,  writable:true },
        hiPos    : { value:0,  writable:true },
        loPos    : { value:0,  writable:true },
        wave     : { value:[], writable:true }
      });

      return Object.seal(o);
    }
    function RHSong() {
      return Object.create(null, {
        speed  : { value:0,    writable:true },
        tracks : { value:null, writable:true }
      });
    }
    function RHPlayer(mixer) {
      var o = AmigaPlayer(mixer);

      Object.defineProperties(o, {
        id         : { value:"RHPlayer" },
        songs      : { value:[],   writable:true },
        samples    : { value:[],   writable:true },
        song       : { value:null, writable:true },
        periods    : { value:0,    writable:true },
        vibrato    : { value:0,    writable:true },
        voices     : { value:[],   writable:true },
        stream     : { value:null, writable:true },
        complete   : { value:0,    writable:true },
        variant    : { value:0,    writable:true },

        initialize: {
          value: function() {
            var i, j, sample, voice = this.voices[3];
            this.reset();

            this.song = this.songs[this.playSong];
            this.complete = 15;

            for (i = 0; i < this.samples.length; ++i) {
              sample = this.samples[i];

              if (sample.wave.length) {
                for (j = 0; j < sample.length; ++j)
                  this.mixer.memory[sample.pointer + j] = sample.wave[j];
              }
            }

            while (voice) {
              voice.initialize();
              voice.channel = this.mixer.channels[voice.index];

              voice.trackPtr = this.song.tracks[voice.index];
              voice.trackPos = 4;

              this.stream.position = voice.trackPtr;
              voice.patternPos = this.stream.readUint();

              voice = voice.next;
            }
        }},
        loader: {
          value: function(stream) {
            var i, j, len, pos, sample, samplesData, samplesHeaders, samplesLen, song, songsHeaders, wavesHeaders, wavesPointers, value;
            stream.position = 44;

            while (stream.position < 1024) {
              value = stream.readUshort();

              if (value == 0x7e10 || value == 0x7e20) {                               //moveq #16,d7 || moveq #32,d7
                value = stream.readUshort();

                if (value == 0x41fa) {                                                //lea $x,a0
                  i = stream.position + stream.readUshort();
                  value = stream.readUshort();

                  if (value == 0xd1fc) {                                              //adda.l
                    samplesData = i + stream.readUint();
                    this.mixer.loopLen = 64;
                    stream.position += 2;
                  } else {
                    samplesData = i;
                    this.mixer.loopLen = 512;
                  }

                  samplesHeaders = stream.position + stream.readUshort();
                  value = stream.readUbyte();
                  if (value == 0x72) samplesLen = stream.readUbyte();                 //moveq #x,d1
                }
              } else if (value == 0x51c9) {                                           //dbf d1,x
                stream.position += 2;
                value = stream.readUshort();

                if (value == 0x45fa) {                                                //lea $x,a2
                  wavesPointers = stream.position + stream.readUshort();
                  stream.position += 2;

                  while (1) {
                    value = stream.readUshort();

                    if (value == 0x4bfa) {                                            //lea $x,a5
                      wavesHeaders = stream.position + stream.readUshort();
                      break;
                    }
                  }
                }
              } else if (value == 0xc0fc) {                                           //mulu.w #x,d0
                stream.position += 2;
                value = stream.readUshort();

                if (value == 0x41eb)                                                  //lea $x(a3),a0
                  songsHeaders = stream.readUshort();
              } else if (value == 0x346d) {                                           //movea.w x(a5),a2
                stream.position += 2;
                value = stream.readUshort();

                if (value == 0x49fa)                                                  //lea $x,a4
                  this.vibrato = stream.position + stream.readUshort();
              } else if (value == 0x4240) {                                           //clr.w d0
                value = stream.readUshort();

                if (value == 0x45fa) {                                                //lea $x,a2
                  this.periods = stream.position + stream.readUshort();
                  break;
                }
              }
            }

            if (!samplesHeaders || !samplesData || !samplesLen || !songsHeaders) return;

            stream.position = samplesData;
            this.samples = [];
            samplesLen++;

            for (i = 0; i < samplesLen; ++i) {
              sample = RHSample();
              sample.length   = stream.readUint();
              sample.relative = parseInt(3579545 / stream.readUshort());
              sample.pointer  = this.mixer.store(stream, sample.length);
              this.samples[i] = sample;
            }

            stream.position = samplesHeaders;

            for (i = 0; i < samplesLen; ++i) {
              sample = this.samples[i];
              stream.position += 4;
              sample.loopPtr = stream.readInt();
              stream.position += 6;
              sample.volume = stream.readUshort();

              if (wavesHeaders) {
                sample.divider = stream.readUshort();
                sample.vibrato = stream.readUshort();
                sample.hiPos   = stream.readUshort();
                sample.loPos   = stream.readUshort();
                stream.position += 8;
              }
            }

            if (wavesHeaders) {
              stream.position = wavesHeaders;
              i = (wavesHeaders - samplesHeaders) >> 5;
              len = i + 3;
              this.variant = 1;

              if (i >= samplesLen) {
                for (j = samplesLen; j < i; ++j)
                  this.samples[j] = RHSample();
              }

              for (; i < len; ++i) {
                sample = RHSample();
                stream.position += 4;
                sample.loopPtr   = stream.readInt();
                sample.length    = stream.readUshort();
                sample.relative  = stream.readUshort();

                stream.position += 2;
                sample.volume  = stream.readUshort();
                sample.divider = stream.readUshort();
                sample.vibrato = stream.readUshort();
                sample.hiPos   = stream.readUshort();
                sample.loPos   = stream.readUshort();

                pos = stream.position;
                stream.position = wavesPointers;
                stream.position = stream.readInt();

                sample.pointer = this.mixer.memory.length;
                this.mixer.memory.length += sample.length;

                for (j = 0; j < sample.length; ++j)
                  sample.wave[j] = stream.readByte();

                this.samples[i] = sample;
                wavesPointers += 4;
                stream.position = pos;
              }
            }

            stream.position = songsHeaders;
            this.songs = [];
            value = 65536;

            while (1) {
              song = RHSong();
              stream.position++;
              song.tracks = new Uint32Array(4);
              song.speed  = stream.readUbyte();

              for (i = 0; i < 4; ++i) {
                j = stream.readUint();
                if (j < value) value = j;
                song.tracks[i] = j;
              }

              this.songs.push(song);
              if ((value - stream.position) < 18) break;
            }

            this.lastSong = this.songs.length - 1;

            stream.length = samplesData;
            stream.position = 0x160;

            while (stream.position < 0x200) {
              value = stream.readUshort();

              if (value == 0xb03c) {                                                  //cmp.b #x,d0
                value = stream.readUshort();

                if (value == 0x0085) {                                                //-123
                  this.variant = 2;
                } else if (value == 0x0086) {                                         //-122
                  this.variant = 4;
                } else if (value == 0x0087) {                                         //-121
                  this.variant = 3;
                }
              }
            }

            this.stream  = stream;
            this.version = 1;
        }},
        process: {
          value: function() {
            var chan, loop, sample, value, voice = this.voices[3];

            while (voice) {
              chan = voice.channel;
              this.stream.position = voice.patternPos;
              sample = voice.sample;

              if (!voice.busy) {
                voice.busy = 1;

                if (sample.loopPtr == 0) {
                  chan.pointer = this.mixer.loopPtr;
                  chan.length  = this.mixer.loopLen;
                } else if (sample.loopPtr > 0) {
                  chan.pointer = sample.pointer + sample.loopPtr;
                  chan.length  = sample.length  - sample.loopPtr;
                }
              }

              if (--voice.tick == 0) {
                voice.flags = 0;
                loop = 1;

                while (loop) {
                  value = this.stream.readByte();

                  if (value < 0) {
                    switch (value) {
                      case -121:
                        if (this.variant == 3) voice.volume = this.stream.readUbyte();
                        break;
                      case -122:
                        if (this.variant == 4) voice.volume = this.stream.readUbyte();
                        break;
                      case -123:
                        if (this.variant > 1) this.mixer.complete = 1;
                        break;
                      case -124:
                        this.stream.position = voice.trackPtr + voice.trackPos;
                        value = this.stream.readUint();
                        voice.trackPos += 4;

                        if (!value) {
                          this.stream.position = voice.trackPtr;
                          value = this.stream.readUint();
                          voice.trackPos = 4;

                          if (!this.loopSong) {
                            this.complete &= ~(voice.bitFlag);
                            if (!this.complete) this.mixer.complete = 1;
                          }
                        }

                        this.stream.position = value;
                        break;
                      case -125:
                        if (this.variant == 4) voice.flags |= 4;
                        break;
                      case -126:
                        voice.tick = this.song.speed * this.stream.readByte();
                        voice.patternPos = this.stream.position;

                        chan.pointer = this.mixer.loopPtr;
                        chan.length  = this.mixer.loopLen;
                        loop = 0;
                        break;
                      case -127:
                        voice.portaSpeed = this.stream.readByte();
                        voice.flags |= 1;
                        break;
                      case -128:
                        value = this.stream.readByte();
                        if (value < 0) value = 0;
                        voice.sample = sample = this.samples[value];
                        voice.vibratoPtr = this.vibrato + sample.vibrato;
                        voice.vibratoPos = voice.vibratoPtr;
                        break;
                    }
                  } else {
                    voice.tick = this.song.speed * value;
                    voice.note = this.stream.readByte();
                    voice.patternPos = this.stream.position;

                    voice.synthPos = sample.loPos;
                    voice.vibratoPos = voice.vibratoPtr;

                    chan.pointer = sample.pointer;
                    chan.length  = sample.length;
                    chan.volume  = (voice.volume) ? voice.volume : sample.volume;

                    this.stream.position = this.periods + (voice.note << 1);
                    value = this.stream.readUshort() * sample.relative;
                    chan.period = voice.period = (value >> 10);

                    chan.enabled = 1;
                    voice.busy = loop = 0;
                  }
                }
              } else {
                if (voice.tick == 1) {
                  if (this.variant != 4 || !(voice.flags & 4))
                    chan.enabled = 0;
                }

                if (voice.flags & 1)
                  chan.period = (voice.period += voice.portaSpeed);

                if (sample.divider) {
                  this.stream.position = voice.vibratoPos;
                  value = this.stream.readByte();

                  if (value == -124) {
                    this.stream.position = voice.vibratoPtr;
                    value = this.stream.readByte();
                  }

                  voice.vibratoPos = this.stream.position;
                  value = parseInt(voice.period / sample.divider) * value;
                  chan.period = voice.period + value;
                }
              }

              if (sample.hiPos) {
                value = 0;

                if (voice.flags & 2) {
                  voice.synthPos--;

                  if (voice.synthPos <= sample.loPos) {
                    voice.flags &= -3;
                    value = 60;
                  }
                } else {
                  voice.synthPos++;

                  if (voice.synthPos > sample.hiPos) {
                    voice.flags |= 2;
                    value = 60;
                  }
                }

                this.mixer.memory[sample.pointer + voice.synthPos] = value;
              }

              voice = voice.next;
            }
        }}
      });

      o.voices[3] = RHVoice(3,8);
      o.voices[3].next = o.voices[2] = RHVoice(2,4);
      o.voices[2].next = o.voices[1] = RHVoice(1,2);
      o.voices[1].next = o.voices[0] = RHVoice(0,1);

      return Object.seal(o);
    }

    window.neoart.RHPlayer = RHPlayer;
  })();
/*
  Flod JS 2.0
  2012/04/01
  Christian Corti
  Neoart Costa Rica

  Last Update: Flod JS 2.0 - 2012/03/24

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
  OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
  LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR
  IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

  This work is licensed under the Creative Commons Attribution-Noncommercial-Share Alike 3.0 Unported License.
  To view a copy of this license, visit http://creativecommons.org/licenses/by-nc-sa/3.0/ or send a letter to
  Creative Commons, 171 Second Street, Suite 300, San Francisco, California, 94105, USA.
*/
  (function() {
    function DWVoice(idx, bit) {
      return Object.create(null, {
        index         : { value:idx,  writable:true },
        bitFlag       : { value:bit,  writable:true },
        next          : { value:null, writable:true },
        channel       : { value:null, writable:true },
        sample        : { value:null, writable:true },
        trackPtr      : { value:0,    writable:true },
        trackPos      : { value:0,    writable:true },
        patternPos    : { value:0,    writable:true },
        frqseqPtr     : { value:0,    writable:true },
        frqseqPos     : { value:0,    writable:true },
        volseqPtr     : { value:0,    writable:true },
        volseqPos     : { value:0,    writable:true },
        volseqSpeed   : { value:0,    writable:true },
        volseqCounter : { value:0,    writable:true },
        halve         : { value:0,    writable:true },
        speed         : { value:0,    writable:true },
        tick          : { value:0,    writable:true },
        busy          : { value:0,    writable:true },
        flags         : { value:0,    writable:true },
        note          : { value:0,    writable:true },
        period        : { value:0,    writable:true },
        transpose     : { value:0,    writable:true },
        portaDelay    : { value:0,    writable:true },
        portaDelta    : { value:0,    writable:true },
        portaSpeed    : { value:0,    writable:true },
        vibrato       : { value:0,    writable:true },
        vibratoDelta  : { value:0,    writable:true },
        vibratoSpeed  : { value:0,    writable:true },
        vibratoDepth  : { value:0,    writable:true },

        initialize: {
          value: function() {
            this.channel       = null;
            this.sample        = null;
            this.trackPtr      = 0;
            this.trackPos      = 0;
            this.patternPos    = 0;
            this.frqseqPtr     = 0;
            this.frqseqPos     = 0;
            this.volseqPtr     = 0;
            this.volseqPos     = 0;
            this.volseqSpeed   = 0;
            this.volseqCounter = 0;
            this.halve         = 0;
            this.speed         = 0;
            this.tick          = 1;
            this.busy          = -1;
            this.flags         = 0;
            this.note          = 0;
            this.period        = 0;
            this.transpose     = 0;
            this.portaDelay    = 0;
            this.portaDelta    = 0;
            this.portaSpeed    = 0;
            this.vibrato       = 0;
            this.vibratoDelta  = 0;
            this.vibratoSpeed  = 0;
            this.vibratoDepth  = 0;
        }}
      });
    }
    function DWSample() {
      var o = AmigaSample();

      Object.defineProperties(o, {
        relative : { value:0,  writable:true },
        finetune : { value:0,  writable:true }
      });

      return Object.seal(o);
    }
    function DWSong() {
      return Object.create(null, {
        speed  : { value:0,    writable:true },
        delay  : { value:0,    writable:true },
        tracks : { value:null, writable:true }
      });
    }
    function DWPlayer(mixer) {
      var o = AmigaPlayer(mixer);

      Object.defineProperties(o, {
        id            : { value:"DWPlayer" },
        songs         : { value:[],   writable:true },
        samples       : { value:[],   writable:true },
        stream        : { value:null, writable:true },
        song          : { value:null, writable:true },
        songvol       : { value:0,    writable:true },
        master        : { value:0,    writable:true },
        periods       : { value:0,    writable:true },
        frqseqs       : { value:0,    writable:true },
        volseqs       : { value:0,    writable:true },
        transpose     : { value:0,    writable:true },
        slower        : { value:0,    writable:true },
        slowerCounter : { value:0,    writable:true },
        delaySpeed    : { value:0,    writable:true },
        delayCounter  : { value:0,    writable:true },
        fadeSpeed     : { value:0,    writable:true },
        fadeCounter   : { value:0,    writable:true },
        wave          : { value:null, writable:true },
        waveCenter    : { value:0,    writable:true },
        waveLo        : { value:0,    writable:true },
        waveHi        : { value:0,    writable:true },
        waveDir       : { value:0,    writable:true },
        waveLen       : { value:0,    writable:true },
        wavePos       : { value:0,    writable:true },
        waveRateNeg   : { value:0,    writable:true },
        waveRatePos   : { value:0,    writable:true },
        voices        : { value:[],   writable:true },
        active        : { value:0,    writable:true },
        complete      : { value:0,    writable:true },
        variant       : { value:0,    writable:true },
        base          : { value:0,    writable:true },
        com2          : { value:0,    writable:true },
        com3          : { value:0,    writable:true },
        com4          : { value:0,    writable:true },
        readMix       : { value:"",   writable:true },
        readLen       : { value:0,    writable:true },

        initialize: {
          value: function() {
            var i, len, voice = this.voices[this.active];
            this.reset();

            this.song    = this.songs[this.playSong];
            this.songvol = this.master;
            this.speed   = this.song.speed;

            this.transpose     = 0;
            this.slowerCounter = 6;
            this.delaySpeed    = this.song.delay;
            this.delayCounter  = 0;
            this.fadeSpeed     = 0;
            this.fadeCounter   = 0;

            if (this.wave) {
              this.waveDir = 0;
              this.wavePos = this.wave.pointer + this.waveCenter;
              i = this.wave.pointer;

              len = this.wavePos;
              for (; i < len; ++i) this.mixer.memory[i] = this.waveRateNeg;

              len += this.waveCenter;
              for (; i < len; ++i) this.mixer.memory[i] = this.waveRatePos;
            }

            while (voice) {
              voice.initialize();
              voice.channel = this.mixer.channels[voice.index];
              voice.sample  = this.samples[0];
              this.complete += voice.bitFlag;

              voice.trackPtr = this.song.tracks[voice.index];
              voice.trackPos = this.readLen;
              this.stream.position = voice.trackPtr;
              voice.patternPos = this.base + this.stream[this.readMix]();

              if (this.frqseqs) {
                this.stream.position = this.frqseqs;
                voice.frqseqPtr = this.base + this.stream.readUshort();
                voice.frqseqPos = voice.frqseqPtr;
              }

              voice = voice.next;
            }
        }},
        loader: {
          value: function(stream) {
            var flag, headers, i, index, info, lower, pos, sample, size = 10, song, total, value;

            this.master  = 64;
            this.readMix = "readUshort";
            this.readLen = 2;
            this.variant = 0;

            if (stream.readUshort() == 0x48e7) {                                      //movem.l
              stream.position = 4;
              if (stream.readUshort() != 0x6100) return;                              //bsr.w

              stream.position += stream.readUshort();
              this.variant = 30;
            } else {
              stream.position = 0;
            }

            while (value != 0x4e75) {                                                 //rts
              value = stream.readUshort();

              switch (value) {
                case 0x47fa:                                                          //lea x,a3
                  this.base = stream.position + stream.readShort();
                  break;
                case 0x6100:                                                          //bsr.w
                  stream.position += 2;
                  info = stream.position;

                  if (stream.readUshort() == 0x6100)                                  //bsr.w
                    info = stream.position + stream.readUshort();
                  break;
                case 0xc0fc:                                                          //mulu.w #x,d0
                  size = stream.readUshort();

                  if (size == 18) {
                    this.readMix = "readUint";
                    this.readLen = 4;
                  } else {
                    this.variant = 10;
                  }

                  if (stream.readUshort() == 0x41fa)
                    headers = stream.position + stream.readUshort();

                  if (stream.readUshort() == 0x1230) flag = 1;
                  break;
                case 0x1230:                                                          //move.b (a0,d0.w),d1
                  stream.position -= 6;

                  if (stream.readUshort() == 0x41fa) {
                    headers = stream.position + stream.readUshort();
                    flag = 1;
                  }

                  stream.position += 4;
                  break;
                case 0xbe7c:                                                          //cmp.w #x,d7
                  this.channels = stream.readUshort();
                  stream.position += 2;

                  if (stream.readUshort() == 0x377c)
                    this.master = stream.readUshort();
                  break;
              }

              if (stream.bytesAvailable < 20) return;
            }

            index = stream.position;
            this.songs = [];
            lower = 0x7fffffff;
            total = 0;
            stream.position = headers;

            while (1) {
              song = DWSong();
              song.tracks = new Uint32Array(this.channels);

              if (flag) {
                song.speed = stream.readUbyte();
                song.delay = stream.readUbyte();
              } else {
                song.speed = stream.readUshort();
              }

              if (song.speed > 255) break;

              for (i = 0; i < this.channels; ++i) {
                value = this.base + stream[this.readMix]();
                if (value < lower) lower = value;
                song.tracks[i] = value;
              }

              this.songs[total++] = song;
              if ((lower - stream.position) < size) break;
            }

            if (!total) return;
            this.lastSong = this.songs.length - 1;

            stream.position = info;
            if (stream.readUshort() != 0x4a2b) return;                         //tst.b x(a3)
            headers = size = 0;
            this.wave = null;

            while (value != 0x4e75) {                                                 //rts
              value = stream.readUshort();

              switch (value) {
                case 0x4bfa:
                  if (headers) break;
                  info = stream.position + stream.readShort();
                  stream.position++;
                  total = stream.readUbyte();

                  stream.position -= 10;
                  value = stream.readUshort();
                  pos = stream.position;

                  if (value == 0x41fa || value == 0x207a) {                           //lea x,a0 | movea.l x,a0
                    headers = stream.position + stream.readUshort();
                  } else if (value == 0xd0fc) {                                       //adda.w #x,a0
                    headers = (64 + stream.readUshort());
                    stream.position -= 18;
                    headers += (stream.position + stream.readUshort());
                  }

                  stream.position = pos;
                  break;
                case 0x84c3:                                                          //divu.w d3,d2
                  if (size) break;
                  stream.position += 4;
                  value = stream.readUshort();

                  if (value == 0xdafc) {                                              //adda.w #x,a5
                    size = stream.readUshort();
                  } else if (value == 0xdbfc) {                                       //adda.l #x,a5
                    size = stream.readUint();
                  }

                  if (size == 12 && this.variant < 30) this.variant = 20;

                  pos = stream.position;
                  this.samples = [];
                  this.samples.length = ++total;
                  stream.position = headers;

                  for (i = 0; i < total; ++i) {
                    sample = DWSample();
                    sample.length   = stream.readUint();
                    sample.relative = parseInt(3579545 / stream.readUshort());
                    sample.pointer  = this.mixer.store(stream, sample.length);

                    value = stream.position;
                    stream.position = info + (i * size) + 4;
                    sample.loopPtr = stream.readInt();

                    if (this.variant == 0) {
                      stream.position += 6;
                      sample.volume = stream.readUshort();
                    } else if (this.variant == 10) {
                      stream.position += 4;
                      sample.volume = stream.readUshort();
                      sample.finetune = stream.readByte();
                    }

                    stream.position = value;
                    this.samples[i] = sample;
                  }

                  this.mixer.loopLen = 64;
                  stream.length = headers;
                  stream.position = pos;
                  break;
                case 0x207a:                                                          //movea.l x,a0
                  value = stream.position + stream.readShort();

                  if (stream.readUshort() != 0x323c) {                                //move.w #x,d1
                    stream.position -= 2;
                    break;
                  }

                  this.wave = this.samples[parseInt((value - info) / size)];
                  this.waveCenter = (stream.readUshort() + 1) << 1;

                  stream.position += 2;
                  this.waveRateNeg = stream.readByte();
                  stream.position += 12;
                  this.waveRatePos = stream.readByte();
                  break;
                case 0x046b:                                                          //subi.w #x,x(a3)
                case 0x066b:                                                          //addi.w #x,x(a3)
                  total = stream.readUshort();
                  sample = this.samples[parseInt((stream.readUshort() - info) / size)];

                  if (value == 0x066b) {
                    sample.relative += total;
                  } else {
                    sample.relative -= total;
                  }
                  break;
              }
            }

            if (!this.samples.length) return;
            stream.position = index;

            this.periods = 0;
            this.frqseqs = 0;
            this.volseqs = 0;
            this.slower  = 0;

            this.com2 = 0xb0;
            this.com3 = 0xa0;
            this.com4 = 0x90;

            while (stream.bytesAvailable > 16) {
              value = stream.readUshort();

              switch (value) {
                case 0x47fa:                                                          //lea x,a3
                  stream.position += 2;
                  if (stream.readUshort() != 0x4a2b) break;                           //tst.b x(a3)

                  pos = stream.position;
                  stream.position += 4;
                  value = stream.readUshort();

                  if (value == 0x103a) {                                              //move.b x,d0
                    stream.position += 4;

                    if (stream.readUshort() == 0xc0fc) {                              //mulu.w #x,d0
                      value = stream.readUshort();
                      total = this.songs.length;
                      for (i = 0; i < total; ++i) this.songs[i].delay *= value;
                      stream.position += 6;
                    }
                  } else if (value == 0x532b) {                                       //subq.b #x,x(a3)
                    stream.position -= 8;
                  }

                  value = stream.readUshort();

                  if (value == 0x4a2b) {                                              //tst.b x(a3)
                    stream.position = this.base + stream.readUshort();
                    this.slower = stream.readByte();
                  }

                  stream.position = pos;
                  break;
                case 0x0c6b:                                                          //cmpi.w #x,x(a3)
                  stream.position -= 6;
                  value = stream.readUshort();

                  if (value == 0x546b || value == 0x526b) {                           //addq.w #2,x(a3) | addq.w #1,x(a3)
                    stream.position += 4;
                    this.waveHi = this.wave.pointer + stream.readUshort();
                  } else if (value == 0x556b || value == 0x536b) {                    //subq.w #2,x(a3) | subq.w #1,x(a3)
                    stream.position += 4;
                    this.waveLo = this.wave.pointer + stream.readUshort();
                  }

                  this.waveLen = (value < 0x546b) ? 1 : 2;
                  break;
                case 0x7e00:                                                          //moveq #0,d7
                case 0x7e01:                                                          //moveq #1,d7
                case 0x7e02:                                                          //moveq #2,d7
                case 0x7e03:                                                          //moveq #3,d7
                  this.active = value & 0xf;
                  total = this.channels - 1;

                  if (this.active) {
                    this.voices[0].next = null;
                    for (i = total; i > 0;) this.voices[i].next = this.voices[--i];
                  } else {
                    this.voices[total].next = null;
                    for (i = 0; i < total;) this.voices[i].next = this.voices[++i];
                  }
                  break;
                case 0x0c68:                                                          //cmpi.w #x,x(a0)
                  stream.position += 22;
                  if (stream.readUshort() == 0x0c11) this.variant = 40;
                  break;
                case 0x322d:                                                          //move.w x(a5),d1
                  pos = stream.position;
                  value = stream.readUshort();

                  if (value == 0x000a || value == 0x000c) {                           //10 | 12
                    stream.position -= 8;

                    if (stream.readUshort() == 0x45fa)                                //lea x,a2
                      this.periods = stream.position + stream.readUshort();
                  }

                  stream.position = pos + 2;
                  break;
                case 0x0400:                                                          //subi.b #x,d0
                case 0x0440:                                                          //subi.w #x,d0
                case 0x0600:                                                          //addi.b #x,d0
                  value = stream.readUshort();

                  if (value == 0x00c0 || value == 0x0040) {                           //192 | 64
                    this.com2 = 0xc0;
                    this.com3 = 0xb0;
                    this.com4 = 0xa0;
                  } else if (value == this.com3) {
                    stream.position += 2;

                    if (stream.readUshort() == 0x45fa) {                              //lea x,a2
                      this.volseqs = stream.position + stream.readUshort();
                      if (this.variant < 40) this.variant = 30;
                    }
                  } else if (value == this.com4) {
                    stream.position += 2;

                    if (stream.readUshort() == 0x45fa)                                //lea x,a2
                      this.frqseqs = stream.position + stream.readUshort();
                  }
                  break;
                case 0x4ef3:                                                          //jmp (a3,a2.w)
                  stream.position += 2;
                case 0x4ed2:                                                          //jmp a2
                  lower = stream.position;
                  stream.position -= 10;
                  stream.position += stream.readUshort();
                  pos = stream.position;                                              //jump table address

                  stream.position = pos + 2;                                          //effect -126
                  stream.position = this.base + stream.readUshort() + 10;
                  if (stream.readUshort() == 0x4a14) this.variant = 41;               //tst.b (a4)

                  stream.position = pos + 16;                                         //effect -120
                  value = this.base + stream.readUshort();

                  if (value > lower && value < pos) {
                    stream.position = value;
                    value = stream.readUshort();

                    if (value == 0x50e8) {                                            //st x(a0)
                      this.variant = 21;
                    } else if (value == 0x1759) {                                     //move.b (a1)+,x(a3)
                      this.variant = 11;
                    }
                  }

                  stream.position = pos + 20;                                         //effect -118
                  value = this.base + stream.readUshort();

                  if (value > lower && value < pos) {
                    stream.position = value + 2;
                    if (stream.readUshort() != 0x4880) this.variant = 31;             //ext.w d0
                  }

                  stream.position = pos + 26;                                         //effect -115
                  value = stream.readUshort();
                  if (value > lower && value < pos) this.variant = 32;

                  if (this.frqseqs) stream.position = stream.length;
                  break;
              }
            }

            if (!this.periods) return;
            this.com2 -= 256;
            this.com3 -= 256;
            this.com4 -= 256;

            this.stream = stream;
            this.version = 1;
        }},
        process: {
          value: function() {
            var chan, loop, pos, sample, value, voice = this.voices[this.active], volume;

            if (this.slower) {
              if (--this.slowerCounter == 0) {
                this.slowerCounter = 6;
                return;
              }
            }

            if ((this.delayCounter += this.delaySpeed) > 255) {
              this.delayCounter -= 256;
              return;
            }

            if (this.fadeSpeed) {
              if (--this.fadeCounter == 0) {
                this.fadeCounter = this.fadeSpeed;
                this.songvol--;
              }

              if (!this.songvol) {
                if (!this.loopSong) {
                  this.mixer.complete = 1;
                  return;
                } else {
                  this.initialize();
                }
              }
            }

            if (this.wave) {
              if (this.waveDir) {
                this.mixer.memory[this.wavePos++] = this.waveRatePos;
                if (this.waveLen > 1) this.mixer.memory[this.wavePos++] = this.waveRatePos;
                if ((this.wavePos -= (this.waveLen << 1)) == this.waveLo) this.waveDir = 0;
              } else {
                this.mixer.memory[this.wavePos++] = this.waveRateNeg;
                if (this.waveLen > 1) this.mixer.memory[this.wavePos++] = this.waveRateNeg;
                if (this.wavePos == this.waveHi) this.waveDir = 1;
              }
            }

            while (voice) {
              chan = voice.channel;
              this.stream.position = voice.patternPos;
              sample = voice.sample;

              if (!voice.busy) {
                voice.busy = 1;

                if (sample.loopPtr < 0) {
                  chan.pointer = this.mixer.loopPtr;
                  chan.length  = this.mixer.loopLen;
                } else {
                  chan.pointer = sample.pointer + sample.loopPtr;
                  chan.length  = sample.length  - sample.loopPtr;
                }
              }

              if (--voice.tick == 0) {
                voice.flags = 0;
                loop = 1;

                while (loop > 0) {
                  value = this.stream.readByte();

                  if (value < 0) {
                    if (value >= -32) {
                      voice.speed = this.speed * (value + 33);
                    } else if (value >= this.com2) {
                      value -= this.com2;
                      voice.sample = sample = this.samples[value];
                    } else if (value >= this.com3) {
                      pos = this.stream.position;

                      this.stream.position = this.volseqs + ((value - this.com3) << 1);
                      this.stream.position = this.base + this.stream.readUshort();
                      voice.volseqPtr = this.stream.position;

                      this.stream.position--;
                      voice.volseqSpeed = this.stream.readUbyte();

                      this.stream.position = pos;
                    } else if (value >= this.com4) {
                      pos = this.stream.position;

                      this.stream.position = this.frqseqs + ((value - this.com4) << 1);
                      voice.frqseqPtr = this.base + this.stream.readUshort();
                      voice.frqseqPos = voice.frqseqPtr;

                      this.stream.position = pos;
                    } else {
                      switch (value) {
                        case -128:
                          this.stream.position = voice.trackPtr + voice.trackPos;
                          value = this.stream[this.readMix]();

                          if (value) {
                            this.stream.position = this.base + value;
                            voice.trackPos += this.readLen;
                          } else {
                            this.stream.position = voice.trackPtr;
                            this.stream.position = this.base + this.stream[this.readMix]();
                            voice.trackPos = this.readLen;

                            if (!this.loopSong) {
                              this.complete &= ~(voice.bitFlag);
                              if (!this.complete) this.mixer.complete = 1;
                            }
                          }
                          break;
                        case -127:
                          if (this.variant > 0) voice.portaDelta = 0;
                          voice.portaSpeed = this.stream.readByte();
                          voice.portaDelay = this.stream.readUbyte();
                          voice.flags |= 2;
                          break;
                        case -126:
                          voice.tick = voice.speed;
                          voice.patternPos = this.stream.position;

                          if (this.variant == 41) {
                            voice.busy = 1;
                            chan.enabled = 0;
                          } else {
                            chan.pointer = this.mixer.loopPtr;
                            chan.length  = this.mixer.loopLen;
                          }

                          loop = 0;
                          break;
                        case -125:
                          if (this.variant > 0) {
                            voice.tick = voice.speed;
                            voice.patternPos = this.stream.position;
                            chan.enabled = 1;
                            loop = 0;
                          }
                          break;
                        case -124:
                          this.mixer.complete = 1;
                          break;
                        case -123:
                          if (this.variant > 0) this.transpose = this.stream.readByte();
                          break;
                        case -122:
                          voice.vibrato = -1;
                          voice.vibratoSpeed = this.stream.readUbyte();
                          voice.vibratoDepth = this.stream.readUbyte();
                          voice.vibratoDelta = 0;
                          break;
                        case -121:
                          voice.vibrato = 0;
                          break;
                        case -120:
                          if (this.variant == 21) {
                            voice.halve = 1;
                          } else if (this.variant == 11) {
                            this.fadeSpeed = this.stream.readUbyte();
                          } else {
                            voice.transpose = this.stream.readByte();
                          }
                          break;
                        case -119:
                          if (this.variant == 21) {
                            voice.halve = 0;
                          } else {
                            voice.trackPtr = this.base + this.stream.readUshort();
                            voice.trackPos = 0;
                          }
                          break;
                        case -118:
                          if (this.variant == 31) {
                            this.delaySpeed = this.stream.readUbyte();
                          } else {
                            this.speed = this.stream.readUbyte();
                          }
                          break;
                        case -117:
                          this.fadeSpeed = this.stream.readUbyte();
                          this.fadeCounter = this.fadeSpeed;
                          break;
                        case -116:
                          value = this.stream.readUbyte();
                          if (this.variant != 32) this.songvol = value;
                          break;
                      }
                    }
                  } else {
                    voice.patternPos = this.stream.position;
                    voice.note = (value += sample.finetune);
                    voice.tick = voice.speed;
                    voice.busy = 0;

                    if (this.variant >= 20) {
                      value = (value + this.transpose + voice.transpose) & 0xff;
                      this.stream.position = voice.volseqPtr;
                      volume = this.stream.readUbyte();

                      voice.volseqPos = this.stream.position;
                      voice.volseqCounter = voice.volseqSpeed;

                      if (voice.halve) volume >>= 1;
                      volume = (volume * this.songvol) >> 6;
                    } else {
                      volume = sample.volume;
                    }

                    chan.pointer = sample.pointer;
                    chan.length  = sample.length;
                    chan.volume  = volume;

                    this.stream.position = this.periods + (value << 1);
                    value = (this.stream.readUshort() * sample.relative) >> 10;
                    if (this.variant < 10) voice.portaDelta = value;

                    chan.period  = value;
                    chan.enabled = 1;
                    loop = 0;
                  }
                }
              } else if (voice.tick == 1) {
                if (this.variant < 30) {
                  chan.enabled = 0;
                } else {
                  value = this.stream.readUbyte();

                  if (value != 131) {
                    if (this.variant < 40 || value < 224 || (this.stream.readUbyte() != 131))
                      chan.enabled = 0;
                  }
                }
              } else if (this.variant == 0) {
                if (voice.flags & 2) {
                  if (voice.portaDelay) {
                    voice.portaDelay--;
                  } else {
                    voice.portaDelta -= voice.portaSpeed;
                    chan.period = voice.portaDelta;
                  }
                }
              } else {
                this.stream.position = voice.frqseqPos;
                value = this.stream.readByte();

                if (value < 0) {
                  value &= 0x7f;
                  this.stream.position = voice.frqseqPtr;
                }

                voice.frqseqPos = this.stream.position;

                value = (value + voice.note + this.transpose + voice.transpose) & 0xff;
                this.stream.position = this.periods + (value << 1);
                value = (this.stream.readUshort() * sample.relative) >> 10;

                if (voice.flags & 2) {
                  if (voice.portaDelay) {
                    voice.portaDelay--;
                  } else {
                    voice.portaDelta += voice.portaSpeed;
                    value -= voice.portaDelta;
                  }
                }

                if (voice.vibrato) {
                  if (voice.vibrato > 0) {
                    voice.vibratoDelta -= voice.vibratoSpeed;
                    if (!voice.vibratoDelta) voice.vibrato ^= 0x80000000;
                  } else {
                    voice.vibratoDelta += voice.vibratoSpeed;
                    if (voice.vibratoDelta == voice.vibratoDepth) voice.vibrato ^= 0x80000000;
                  }

                  if (!voice.vibratoDelta) voice.vibrato ^= 1;

                  if (voice.vibrato & 1) {
                    value += voice.vibratoDelta;
                  } else {
                    value -= voice.vibratoDelta;
                  }
                }

                chan.period = value;

                if (this.variant >= 20) {
                  if (--voice.volseqCounter < 0) {
                    this.stream.position = voice.volseqPos;
                    volume = this.stream.readByte();

                    if (volume >= 0) voice.volseqPos = this.stream.position;
                    voice.volseqCounter = voice.volseqSpeed;
                    volume &= 0x7f;

                    if (voice.halve) volume >>= 1;
                    chan.volume = (volume * this.songvol) >> 6;
                  }
                }
              }

              voice = voice.next;
            }
        }}
      });

      o.voices[0] = DWVoice(0,1);
      o.voices[1] = DWVoice(1,2);
      o.voices[2] = DWVoice(2,4);
      o.voices[3] = DWVoice(3,8);

      return Object.seal(o);
    }

    window.neoart.DWPlayer = DWPlayer;
  })();
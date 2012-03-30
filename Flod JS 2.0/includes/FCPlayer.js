/*
  Flod JS 2.0
  2012/04/01
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
  (function() {
    function FCVoice(idx) {
      return Object.create(null, {
        index          : { value:idx,  writable:true },
        next           : { value:null, writable:true },
        channel        : { value:null, writable:true },
        sample         : { value:null, writable:true },
        enabled        : { value:0,    writable:true },
        pattern        : { value:0,    writable:true },
        soundTranspose : { value:0,    writable:true },
        transpose      : { value:0,    writable:true },
        patStep        : { value:0,    writable:true },
        frqStep        : { value:0,    writable:true },
        frqPos         : { value:0,    writable:true },
        frqSustain     : { value:0,    writable:true },
        frqTranspose   : { value:0,    writable:true },
        volStep        : { value:0,    writable:true },
        volPos         : { value:0,    writable:true },
        volCtr         : { value:0,    writable:true },
        volSpeed       : { value:0,    writable:true },
        volSustain     : { value:0,    writable:true },
        note           : { value:0,    writable:true },
        pitch          : { value:0,    writable:true },
        volume         : { value:0,    writable:true },
        pitchBendFlag  : { value:0,    writable:true },
        pitchBendSpeed : { value:0,    writable:true },
        pitchBendTime  : { value:0,    writable:true },
        portamentoFlag : { value:0,    writable:true },
        portamento     : { value:0,    writable:true },
        volBendFlag    : { value:0,    writable:true },
        volBendSpeed   : { value:0,    writable:true },
        volBendTime    : { value:0,    writable:true },
        vibratoFlag    : { value:0,    writable:true },
        vibratoSpeed   : { value:0,    writable:true },
        vibratoDepth   : { value:0,    writable:true },
        vibratoDelay   : { value:0,    writable:true },
        vibrato        : { value:0,    writable:true },

        initialize: {
          value: function() {
            this.sample         = null;
            this.enabled        = 0;
            this.pattern        = 0;
            this.soundTranspose = 0;
            this.transpose      = 0;
            this.patStep        = 0;
            this.frqStep        = 0;
            this.frqPos         = 0;
            this.frqSustain     = 0;
            this.frqTranspose   = 0;
            this.volStep        = 0;
            this.volPos         = 0;
            this.volCtr         = 1;
            this.volSpeed       = 1;
            this.volSustain     = 0;
            this.note           = 0;
            this.pitch          = 0;
            this.volume         = 0;
            this.pitchBendFlag  = 0;
            this.pitchBendSpeed = 0;
            this.pitchBendTime  = 0;
            this.portamentoFlag = 0;
            this.portamento     = 0;
            this.volBendFlag    = 0;
            this.volBendSpeed   = 0;
            this.volBendTime    = 0;
            this.vibratoFlag    = 0;
            this.vibratoSpeed   = 0;
            this.vibratoDepth   = 0;
            this.vibratoDelay   = 0;
            this.vibrato        = 0;
        }},
        volumeBend: {
          value: function() {
            this.volBendFlag ^= 1;

            if (this.volBendFlag) {
              this.volBendTime--;
              this.volume += this.volBendSpeed;
              if (this.volume < 0 || this.volume > 64) this.volBendTime = 0;
            }
        }}
      });
    }
    function FCPlayer(mixer) {
      var o = AmigaPlayer(mixer);

      Object.defineProperties(o, {
        id      : { value:"FCPlayer" },
        seqs    : { value:null, writable:true },
        pats    : { value:null, writable:true },
        vols    : { value:null, writable:true },
        frqs    : { value:null, writable:true },
        length  : { value:0,    writable:true },
        samples : { value:[],   writable:true },
        voices  : { value:[],   writable:true },

        initialize: {
          value: function() {
            var voice = this.voices[0];
            this.reset();

            this.seqs.position = 0;
            this.pats.position = 0;
            this.vols.position = 0;
            this.frqs.position = 0;

            while (voice) {
              voice.initialize();
              voice.channel = this.mixer.channels[voice.index];

              voice.pattern = this.seqs.readUbyte() << 6;
              voice.transpose = this.seqs.readByte();
              voice.soundTranspose = this.seqs.readByte();

              voice = voice.next;
            }

            this.speed = this.seqs.readUbyte();
            if (!this.speed) this.speed = 3;
            this.tick = this.speed;
        }},
        loader: {
          value: function(stream) {
            var i, id, j, len, offset, position, sample, size, temp, total;
            id = stream.readString(4);

            if (id == "SMOD") this.version = FUTURECOMP_10;
              else if (id == "FC14") this.version = FUTURECOMP_14;
                else return;

            stream.position = 4;
            this.length = stream.readUint();
            stream.position = this.version == FUTURECOMP_10 ? 100 : 180;
            this.seqs = ByteArray(new ArrayBuffer(this.length));
            stream.readBytes(this.seqs, 0, this.length);
            this.length = (this.length / 13) >> 0;

            stream.position = 12;
            len = stream.readUint();
            stream.position = 8;
            stream.position = stream.readUint();
            this.pats = ByteArray(new ArrayBuffer(len + 1));
            stream.readBytes(this.pats, 0, len);

            stream.position = 20;
            len = stream.readUint();
            stream.position = 16;
            stream.position = stream.readUint();
            this.frqs = ByteArray(new ArrayBuffer(len + 9));
            this.frqs.writeInt(0x01000000);
            this.frqs.writeInt(0x000000e1);
            stream.readBytes(this.frqs, 8, len);

            this.frqs.position = this.frqs.length - 1;
            this.frqs.writeByte(0xe1);
            this.frqs.position = 0;

            stream.position = 28;
            len = stream.readUint();
            stream.position = 24;
            stream.position = stream.readUint();
            this.vols = ByteArray(new ArrayBuffer(len + 8));
            this.vols.writeInt(0x01000000);
            this.vols.writeInt(0x000000e1);
            stream.readBytes(this.vols, 8, len);

            stream.position = 32;
            size = stream.readUint();
            stream.position = 40;

            if (this.version == FUTURECOMP_10) {
              this.samples.length = 57,
              offset = 0;
            } else {
              this.samples.length = 200;
              offset = 2;
            }

            for (i = 0; i < 10; ++i) {
              len = stream.readUshort() << 1;

              if (len > 0) {
                position = stream.position;
                stream.position = size;
                id = stream.readString(4);

                if (id == "SSMP") {
                  temp = len;

                  for (j = 0; j < 10; ++j) {
                    stream.readInt();
                    len = stream.readUshort() << 1;

                    if (len > 0) {
                      sample = AmigaSample();
                      sample.length = len + 2;
                      sample.loop   = stream.readUshort();
                      sample.repeat = stream.readUshort() << 1;

                      if ((sample.loop + sample.repeat) > sample.length)
                        sample.repeat = sample.length - sample.loop;

                      if ((size + sample.length) > stream.length)
                        sample.length = stream.length - size;

                      sample.pointer = this.mixer.store(stream, sample.length, size + total);
                      sample.loopPtr = sample.pointer + sample.loop;
                      this.samples[100 + (i * 10) + j] = sample;
                      total += sample.length;
                      stream.position += 6;
                    } else {
                      stream.position += 10;
                    }
                  }

                  size += (temp + 2);
                  stream.position = position + 4;
                } else {
                  stream.position = position;
                  sample = AmigaSample();
                  sample.length = len + offset;
                  sample.loop   = stream.readUshort();
                  sample.repeat = stream.readUshort() << 1;

                  if ((sample.loop + sample.repeat) > sample.length)
                    sample.repeat = sample.length - sample.loop;

                  if ((size + sample.length) > stream.length)
                    sample.length = stream.length - size;

                  sample.pointer = this.mixer.store(stream, sample.length, size);
                  sample.loopPtr = sample.pointer + sample.loop;
                  this.samples[i] = sample;
                  size += sample.length;
                }
              } else {
                stream.position += 4;
              }
            }

            if (this.version == FUTURECOMP_10) {
              offset = 0; temp = 47;

              for (i = 10; i < 57; ++i) {
                sample = AmigaSample();
                sample.length  = WAVES[offset++] << 1;
                sample.loop    = 0;
                sample.repeat  = sample.length;

                position = this.mixer.memory.length;
                sample.pointer = position;
                sample.loopPtr = position;
                this.samples[i] = sample;

                len = position + sample.length;

                for (j = position; j < len; ++j)
                  this.mixer.memory[j] = WAVES[temp++];
              }
            } else {
              stream.position = 36;
              size = stream.readUint();
              stream.position = 100;

              for (i = 10; i < 90; ++i) {
                len = stream.readUbyte() << 1;
                if (len < 2) continue;

                sample = AmigaSample();
                sample.length = len;
                sample.loop   = 0;
                sample.repeat = sample.length;

                if ((size + sample.length) > stream.length)
                  sample.length = stream.length - size;

                sample.pointer = this.mixer.store(stream, sample.length, size);
                sample.loopPtr = sample.pointer;
                this.samples[i] = sample;
                size += sample.length;
              }
            }

            this.length *= 13;
        }},
        process: {
          value: function() {
            var base, chan, delta, i, info, loopEffect, loopSustain, period, sample, temp, voice = this.voices[0];

            if (--this.tick == 0) {
              base = this.seqs.position;

              while (voice) {
                chan = voice.channel;

                this.pats.position = voice.pattern + voice.patStep;
                temp = this.pats.readUbyte();

                if (voice.patStep >= 64 || temp == 0x49) {
                  if (this.seqs.position == this.length) {
                    this.seqs.position  = 0;
                    this.mixer.complete = 1;
                  }

                  voice.patStep = 0;
                  voice.pattern = this.seqs.readUbyte() << 6;
                  voice.transpose = this.seqs.readByte();
                  voice.soundTranspose = this.seqs.readByte();

                  this.pats.position = voice.pattern;
                  temp = this.pats.readUbyte();
                }
                info = this.pats.readUbyte();
                this.frqs.position = 0;
                this.vols.position = 0;

                if (temp != 0) {
                  voice.note = temp & 0x7f;
                  voice.pitch = 0;
                  voice.portamento = 0;
                  voice.enabled = chan.enabled = 0;

                  temp = 8 + (((info & 0x3f) + voice.soundTranspose) << 6);
                  if (temp >= 0 && temp < this.vols.length) this.vols.position = temp;
 
                  voice.volStep = 0;
                  voice.volSpeed = voice.volCtr = this.vols.readUbyte();
                  voice.volSustain = 0;

                  voice.frqPos = 8 + (this.vols.readUbyte() << 6);
                  voice.frqStep = 0;
                  voice.frqSustain = 0;

                  voice.vibratoFlag  = 0;
                  voice.vibratoSpeed = this.vols.readUbyte();
                  voice.vibratoDepth = voice.vibrato = this.vols.readUbyte();
                  voice.vibratoDelay = this.vols.readUbyte();
                  voice.volPos = this.vols.position;
                }

                if (info & 0x40) {
                  voice.portamento = 0;
                } else if (info & 0x80) {
                  voice.portamento = this.pats[this.pats.position + 1];
                  if (this.version == FUTURECOMP_10) voice.portamento <<= 1;
                }
                voice.patStep += 2;
                voice = voice.next;
              }

              if (this.seqs.position != base) {
                temp = this.seqs.readUbyte();
                if (temp) this.speed = temp;
              }
              this.tick = this.speed;
            }
            voice = this.voices[0];

            while (voice) {
              chan = voice.channel;

              do {
                loopSustain = 0;

                if (voice.frqSustain) {
                  voice.frqSustain--;
                  break;
                }
                this.frqs.position = voice.frqPos + voice.frqStep;

                do {
                  loopEffect = 0;
                  if (!this.frqs.bytesAvailable) break;
                  info = this.frqs.readUbyte();
                  if (info == 0xe1) break;

                  if (info == 0xe0) {
                    voice.frqStep = this.frqs.readUbyte() & 0x3f;
                    this.frqs.position = voice.frqPos + voice.frqStep;
                    info = this.frqs.readUbyte();
                  }

                  switch (info) {
                    case 0xe2:  //set wave
                      chan.enabled  = 0;
                      voice.enabled = 1
                      voice.volCtr  = 1;
                      voice.volStep = 0;
                    case 0xe4:  //change wave:
                      sample = this.samples[this.frqs.readUbyte()];
                      if (sample) {
                        chan.pointer = sample.pointer;
                        chan.length  = sample.length;
                      } else {
                        voice.enabled = 0;
                      }
                      voice.sample = sample;
                      voice.frqStep += 2;
                      break;
                    case 0xe9:  //set pack
                      temp = 100 + (this.frqs.readUbyte() * 10);
                      sample = this.samples[temp + this.frqs.readUbyte()];

                      if (sample) {
                        chan.enabled = 0;
                        chan.pointer = sample.pointer;
                        chan.length  = sample.length;
                        voice.enabled = 1;
                      }

                      voice.sample = sample;
                      voice.volCtr = 1;
                      voice.volStep = 0;
                      voice.frqStep += 3;
                      break;
                    case 0xe7:  //new sequence
                      loopEffect = 1;
                      voice.frqPos = 8 + (this.frqs.readUbyte() << 6);
                      if (voice.frqPos >= this.frqs.length) voice.frqPos = 0;
                      voice.frqStep = 0;
                      this.frqs.position = voice.frqPos;
                      break;
                    case 0xea:  //pitch bend
                      voice.pitchBendSpeed = this.frqs.readByte();
                      voice.pitchBendTime  = this.frqs.readUbyte();
                      voice.frqStep += 3;
                      break;
                    case 0xe8:  //sustain
                      loopSustain = 1;
                      voice.frqSustain = this.frqs.readUbyte();
                      voice.frqStep += 2;
                      break;
                    case 0xe3:  //new vibrato
                      voice.vibratoSpeed = this.frqs.readUbyte();
                      voice.vibratoDepth = this.frqs.readUbyte();
                      voice.frqStep += 3;
                      break;
                  }

                  if (!loopSustain && !loopEffect) {
                    this.frqs.position = voice.frqPos + voice.frqStep;
                    voice.frqTranspose = this.frqs.readByte();
                    voice.frqStep++;
                  }
                } while (loopEffect);
              } while (loopSustain);

              if (voice.volSustain) {
                voice.volSustain--;
              } else {
                if (voice.volBendTime) {
                  voice.volumeBend();
                } else {
                  if (--voice.volCtr == 0) {
                    voice.volCtr = voice.volSpeed;

                    do {
                      loopEffect = 0;
                      this.vols.position = voice.volPos + voice.volStep;
                      if (!this.vols.bytesAvailable) break;
                      info = this.vols.readUbyte();
                      if (info == 0xe1) break;

                      switch (info) {
                        case 0xea: //volume slide
                          voice.volBendSpeed = this.vols.readByte();
                          voice.volBendTime  = this.vols.readUbyte();
                          voice.volStep += 3;
                          voice.volumeBend();
                          break;
                        case 0xe8: //volume sustain
                          voice.volSustain = this.vols.readUbyte();
                          voice.volStep += 2;
                          break;
                        case 0xe0: //volume loop
                          loopEffect = 1;
                          temp = this.vols.readUbyte() & 0x3f;
                          voice.volStep = temp - 5;
                          break;
                        default:
                          voice.volume = info;
                          voice.volStep++;
                          break;
                      }
                    } while (loopEffect);
                  }
                }
              }
              info = voice.frqTranspose;
              if (info >= 0) info += (voice.note + voice.transpose);
              info &= 0x7f;
              period = PERIODS[info];

              if (voice.vibratoDelay) {
                voice.vibratoDelay--;
              } else {
                temp = voice.vibrato;

                if (voice.vibratoFlag) {
                  delta = voice.vibratoDepth << 1;
                  temp += voice.vibratoSpeed;

                  if (temp > delta) {
                    temp = delta;
                    voice.vibratoFlag = 0;
                  }
                } else {
                  temp -= voice.vibratoSpeed;

                  if (temp < 0) {
                    temp = 0;
                    voice.vibratoFlag = 1;
                  }
                }
                voice.vibrato = temp;
                temp -= voice.vibratoDepth;
                base = (info << 1) + 160;

                while (base < 256) {
                  temp <<= 1;
                  base += 24;
                }
                period += temp;
              }
              voice.portamentoFlag ^= 1;

              if (voice.portamentoFlag && voice.portamento) {
                if (voice.portamento > 0x1f)
                  voice.pitch += voice.portamento & 0x1f;
                else
                  voice.pitch -= voice.portamento;
              }
              voice.pitchBendFlag ^= 1;

              if (voice.pitchBendFlag && voice.pitchBendTime) {
                voice.pitchBendTime--;
                voice.pitch -= voice.pitchBendSpeed;
              }
              period += voice.pitch;

              if (period < 113) period = 113;
                else if (period > 3424) period = 3424;

              chan.period = period;
              chan.volume = voice.volume;

              if (voice.sample) {
                sample = voice.sample;
                chan.enabled = voice.enabled;
                chan.pointer = sample.loopPtr;
                chan.length  = sample.repeat;
              }
              voice = voice.next;
            }
        }}
      });

      o.voices[0] = FCVoice(0);
      o.voices[0].next = o.voices[1] = FCVoice(1);
      o.voices[1].next = o.voices[2] = FCVoice(2);
      o.voices[2].next = o.voices[3] = FCVoice(3);

      return Object.seal(o);
    }

    var FUTURECOMP_10 = 1,
        FUTURECOMP_14 = 2,

        PERIODS = [
          1712,1616,1524,1440,1356,1280,1208,1140,1076,1016, 960, 906,
           856, 808, 762, 720, 678, 640, 604, 570, 538, 508, 480, 453,
           428, 404, 381, 360, 339, 320, 302, 285, 269, 254, 240, 226,
           214, 202, 190, 180, 170, 160, 151, 143, 135, 127, 120, 113,
           113, 113, 113, 113, 113, 113, 113, 113, 113, 113, 113, 113,
          3424,3232,3048,2880,2712,2560,2416,2280,2152,2032,1920,1812,
          1712,1616,1524,1440,1356,1280,1208,1140,1076,1016, 960, 906,
           856, 808, 762, 720, 678, 640, 604, 570, 538, 508, 480, 453,
           428, 404, 381, 360, 339, 320, 302, 285, 269, 254, 240, 226,
           214, 202, 190, 180, 170, 160, 151, 143, 135, 127, 120, 113,
           113, 113, 113, 113, 113, 113, 113, 113, 113, 113, 113, 113],

        WAVES = [
            16,  16,  16,  16,  16,  16,  16,  16,  16,  16,  16,  16,  16,  16,  16,  16,
            16,  16,  16,  16,  16,  16,  16,  16,  16,  16,  16,  16,  16,  16,  16,  16,
             8,   8,   8,   8,   8,   8,   8,   8,  16,   8,  16,  16,   8,   8,  24, -64,
           -64, -48, -40, -32, -24, -16,  -8,   0,  -8, -16, -24, -32, -40, -48, -56,  63,
            55,  47,  39,  31,  23,  15,   7,  -1,   7,  15,  23,  31,  39,  47,  55, -64,
           -64, -48, -40, -32, -24, -16,  -8,   0,  -8, -16, -24, -32, -40, -48, -56, -64,
            55,  47,  39,  31,  23,  15,   7,  -1,   7,  15,  23,  31,  39,  47,  55, -64,
           -64, -48, -40, -32, -24, -16,  -8,   0,  -8, -16, -24, -32, -40, -48, -56, -64,
           -72,  47,  39,  31,  23,  15,   7,  -1,   7,  15,  23,  31,  39,  47,  55, -64,
           -64, -48, -40, -32, -24, -16,  -8,   0,  -8, -16, -24, -32, -40, -48, -56, -64,
           -72, -80,  39,  31,  23,  15,   7,  -1,   7,  15,  23,  31,  39,  47,  55, -64,
           -64, -48, -40, -32, -24, -16,  -8,   0,  -8, -16, -24, -32, -40, -48, -56, -64,
           -72, -80, -88,  31,  23,  15,   7,  -1,   7,  15,  23,  31,  39,  47,  55, -64,
           -64, -48, -40, -32, -24, -16,  -8,   0,  -8, -16, -24, -32, -40, -48, -56, -64,
           -72, -80, -88, -96,  23,  15,   7,  -1,   7,  15,  23,  31,  39,  47,  55, -64,
           -64, -48, -40, -32, -24, -16,  -8,   0,  -8, -16, -24, -32, -40, -48, -56, -64,
           -72, -80, -88, -96,-104,  15,   7,  -1,   7,  15,  23,  31,  39,  47,  55, -64,
           -64, -48, -40, -32, -24, -16,  -8,   0,  -8, -16, -24, -32, -40, -48, -56, -64,
           -72, -80, -88, -96,-104,-112,   7,  -1,   7,  15,  23,  31,  39,  47,  55, -64,
           -64, -48, -40, -32, -24, -16,  -8,   0,  -8, -16, -24, -32, -40, -48, -56, -64,
           -72, -80, -88, -96,-104,-112,-120,  -1,   7,  15,  23,  31,  39,  47,  55, -64,
           -64, -48, -40, -32, -24, -16,  -8,   0,  -8, -16, -24, -32, -40, -48, -56, -64,
           -72, -80, -88, -96,-104,-112,-120,-128,   7,  15,  23,  31,  39,  47,  55, -64,
           -64, -48, -40, -32, -24, -16,  -8,   0,  -8, -16, -24, -32, -40, -48, -56, -64,
           -72, -80, -88, -96,-104,-112,-120,-128,-120,  15,  23,  31,  39,  47,  55, -64,
           -64, -48, -40, -32, -24, -16,  -8,   0,  -8, -16, -24, -32, -40, -48, -56, -64,
           -72, -80, -88, -96,-104,-112,-120,-128,-120,-112,  23,  31,  39,  47,  55, -64,
           -64, -48, -40, -32, -24, -16,  -8,   0,  -8, -16, -24, -32, -40, -48, -56, -64,
           -72, -80, -88, -96,-104,-112,-120,-128,-120,-112,-104,  31,  39,  47,  55, -64,
           -64, -48, -40, -32, -24, -16,  -8,   0,  -8, -16, -24, -32, -40, -48, -56, -64,
           -72, -80, -88, -96,-104,-112,-120,-128,-120,-112,-104, -96,  39,  47,  55, -64,
           -64, -48, -40, -32, -24, -16,  -8,   0,  -8, -16, -24, -32, -40, -48, -56, -64,
           -72, -80, -88, -96,-104,-112,-120,-128,-120,-112,-104, -96, -88,  47,  55, -64,
           -64, -48, -40, -32, -24, -16,  -8,   0,  -8, -16, -24, -32, -40, -48, -56, -64,
           -72, -80, -88, -96,-104,-112,-120,-128,-120,-112,-104, -96, -88, -80,  55,-127,
          -127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127, 127,
           127, 127, 127, 127, 127, 127, 127, 127, 127, 127, 127, 127, 127, 127, 127,-127,
          -127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,
           127, 127, 127, 127, 127, 127, 127, 127, 127, 127, 127, 127, 127, 127, 127,-127,
          -127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,
          -127, 127, 127, 127, 127, 127, 127, 127, 127, 127, 127, 127, 127, 127, 127,-127,
          -127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,
          -127,-127, 127, 127, 127, 127, 127, 127, 127, 127, 127, 127, 127, 127, 127,-127,
          -127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,
          -127,-127,-127, 127, 127, 127, 127, 127, 127, 127, 127, 127, 127, 127, 127,-127,
          -127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,
          -127,-127,-127,-127, 127, 127, 127, 127, 127, 127, 127, 127, 127, 127, 127,-127,
          -127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,
          -127,-127,-127,-127,-127, 127, 127, 127, 127, 127, 127, 127, 127, 127, 127,-127,
          -127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,
          -127,-127,-127,-127,-127,-127, 127, 127, 127, 127, 127, 127, 127, 127, 127,-127,
          -127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,
          -127,-127,-127,-127,-127,-127,-127, 127, 127, 127, 127, 127, 127, 127, 127,-127,
          -127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,
          -127,-127,-127,-127,-127,-127,-127,-127, 127, 127, 127, 127, 127, 127, 127,-127,
          -127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,
          -127,-127,-127,-127,-127,-127,-127,-127,-127, 127, 127, 127, 127, 127, 127,-127,
          -127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,
          -127,-127,-127,-127,-127,-127,-127,-127,-127,-127, 127, 127, 127, 127, 127,-127,
          -127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,
          -127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127, 127, 127, 127, 127,-127,
          -127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,
          -127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127, 127, 127, 127,-128,
          -128,-128,-128,-128,-128,-128,-128,-128,-128,-128,-128,-128,-128,-128,-128,-128,
          -128,-128,-128,-128,-128,-128,-128,-128,-128,-128,-128,-128,-128, 127, 127,-128,
          -128,-128,-128,-128,-128,-128,-128,-128,-128,-128,-128,-128,-128,-128,-128,-128,
          -128,-128,-128,-128,-128,-128,-128,-128,-128,-128,-128,-128,-128,-128, 127,-128,
          -128,-128,-128,-128,-128,-128,-128, 127, 127, 127, 127, 127, 127, 127, 127,-128,
          -128,-128,-128,-128,-128,-128, 127, 127, 127, 127, 127, 127, 127, 127, 127,-128,
          -128,-128,-128,-128,-128, 127, 127, 127, 127, 127, 127, 127, 127, 127, 127,-128,
          -128,-128,-128,-128, 127, 127, 127, 127, 127, 127, 127, 127, 127, 127, 127,-128,
          -128,-128,-128, 127, 127, 127, 127, 127, 127, 127, 127, 127, 127, 127, 127,-128,
          -128,-128, 127, 127, 127, 127, 127, 127, 127, 127, 127, 127, 127, 127, 127,-128,
          -128, 127, 127, 127, 127, 127, 127, 127, 127, 127, 127, 127, 127, 127, 127,-128,
          -128, 127, 127, 127, 127, 127, 127, 127, 127, 127, 127, 127, 127, 127, 127,-128,
          -128,-112,-104, -96, -88, -80, -72, -64, -56, -48, -40, -32, -24, -16,  -8,   0,
             8,  16,  24,  32,  40,  48,  56,  64,  72,  80,  88,  96, 104, 112, 127,-128,
          -128, -96, -80, -64, -48, -32, -16,   0,  16,  32,  48,  64,  80,  96, 112,  69,
            69, 121, 125, 122, 119, 112, 102,  97,  88,  83,  77,  44,  32,  24,  18,   4,
           -37, -45, -51, -58, -68, -75, -82, -88, -93, -99,-103,-109,-114,-117,-118,  69,
            69, 121, 125, 122, 119, 112, 102,  91,  75,  67,  55,  44,  32,  24,  18,   4,
            -8, -24, -37, -49, -58, -66, -80, -88, -92, -98,-102,-107,-108,-115,-125,   0,
             0,  64,  96, 127,  96,  64,  32,   0, -32, -64, -96,-128, -96, -64, -32,   0,
             0,  64,  96, 127,  96,  64,  32,   0, -32, -64, -96,-128, -96, -64, -32,-128,
          -128,-112,-104, -96, -88, -80, -72, -64, -56, -48, -40, -32, -24, -16,  -8,   0,
             8,  16,  24,  32,  40,  48,  56,  64,  72,  80,  88,  96, 104, 112, 127,-128,
          -128, -96, -80, -64, -48, -32, -16,   0,  16,  32,  48,  64,  80,  96, 112];

    window.neoart.FCPlayer = FCPlayer;
  })();
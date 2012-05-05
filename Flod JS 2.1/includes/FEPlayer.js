/*
  Flod JS 2.1
  2012/04/30
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
    function FEVoice(idx, bit) {
      return Object.create(null, {
        index         : { value:idx,  writable:true },
        bitFlag       : { value:bit,  writable:true },
        next          : { value:null, writable:true },
        channel       : { value:null, writable:true },
        sample        : { value:null, writable:true },
        trackPos      : { value:0,    writable:true },
        patternPos    : { value:0,    writable:true },
        tick          : { value:0,    writable:true },
        busy          : { value:0,    writable:true },
        synth         : { value:0,    writable:true },
        note          : { value:0,    writable:true },
        period        : { value:0,    writable:true },
        volume        : { value:0,    writable:true },
        envelopePos   : { value:0,    writable:true },
        sustainTime   : { value:0,    writable:true },
        arpeggioPos   : { value:0,    writable:true },
        arpeggioSpeed : { value:0,    writable:true },
        portamento    : { value:0,    writable:true },
        portaCounter  : { value:0,    writable:true },
        portaDelay    : { value:0,    writable:true },
        portaFlag     : { value:0,    writable:true },
        portaLimit    : { value:0,    writable:true },
        portaNote     : { value:0,    writable:true },
        portaPeriod   : { value:0,    writable:true },
        portaSpeed    : { value:0,    writable:true },
        vibrato       : { value:0,    writable:true },
        vibratoDelay  : { value:0,    writable:true },
        vibratoDepth  : { value:0,    writable:true },
        vibratoFlag   : { value:0,    writable:true },
        vibratoSpeed  : { value:0,    writable:true },
        pulseCounter  : { value:0,    writable:true },
        pulseDelay    : { value:0,    writable:true },
        pulseDir      : { value:0,    writable:true },
        pulsePos      : { value:0,    writable:true },
        pulseSpeed    : { value:0,    writable:true },
        blendCounter  : { value:0,    writable:true },
        blendDelay    : { value:0,    writable:true },
        blendDir      : { value:0,    writable:true },
        blendPos      : { value:0,    writable:true },

        initialize: {
          value: function() {
            this.channel       = null;
            this.sample        = null;
            this.trackPos      = 0;
            this.patternPos    = 0;
            this.tick          = 1;
            this.busy          = 1;
            this.note          = 0;
            this.period        = 0;
            this.volume        = 0;
            this.envelopePos   = 0;
            this.sustainTime   = 0;
            this.arpeggioPos   = 0;
            this.arpeggioSpeed = 0;
            this.portamento    = 0;
            this.portaCounter  = 0;
            this.portaDelay    = 0;
            this.portaFlag     = 0;
            this.portaLimit    = 0;
            this.portaNote     = 0;
            this.portaPeriod   = 0;
            this.portaSpeed    = 0;
            this.vibrato       = 0;
            this.vibratoDelay  = 0;
            this.vibratoDepth  = 0;
            this.vibratoFlag   = 0;
            this.vibratoSpeed  = 0;
            this.pulseCounter  = 0;
            this.pulseDelay    = 0;
            this.pulseDir      = 0;
            this.pulsePos      = 0;
            this.pulseSpeed    = 0;
            this.blendCounter  = 0;
            this.blendDelay    = 0;
            this.blendDir      = 0;
            this.blendPos      = 0;
        }}
      });
    }
    function FESample() {
      return Object.create(null, {
        pointer       : { value:0,    writable:true },
        loopPtr       : { value:0,    writable:true },
        length        : { value:0,    writable:true },
        relative      : { value:0,    writable:true },
        type          : { value:0,    writable:true },
        synchro       : { value:0,    writable:true },
        envelopeVol   : { value:0,    writable:true },
        attackSpeed   : { value:0,    writable:true },
        attackVol     : { value:0,    writable:true },
        decaySpeed    : { value:0,    writable:true },
        decayVol      : { value:0,    writable:true },
        sustainTime   : { value:0,    writable:true },
        releaseSpeed  : { value:0,    writable:true },
        releaseVol    : { value:0,    writable:true },
        arpeggio      : { value:null, writable:true },
        arpeggioLimit : { value:0,    writable:true },
        arpeggioSpeed : { value:0,    writable:true },
        vibratoDelay  : { value:0,    writable:true },
        vibratoDepth  : { value:0,    writable:true },
        vibratoSpeed  : { value:0,    writable:true },
        pulseCounter  : { value:0,    writable:true },
        pulseDelay    : { value:0,    writable:true },
        pulsePosL     : { value:0,    writable:true },
        pulsePosH     : { value:0,    writable:true },
        pulseSpeed    : { value:0,    writable:true },
        pulseRateNeg  : { value:0,    writable:true },
        pulseRatePos  : { value:0,    writable:true },
        blendCounter  : { value:0,    writable:true },
        blendDelay    : { value:0,    writable:true },
        blendRate     : { value:0,    writable:true }
      });
    }
    function FESong() {
      return Object.create(null, {
        speed  : { value:0,  writable:true },
        length : { value:0,  writable:true },
        tracks : { value:[], writable:true }
      });
    }
    function FEPlayer(mixer) {
      var o = AmigaPlayer(mixer);

      Object.defineProperties(o, {
        id       : { value:"FEPlayer" },
        songs    : { value:[],   writable:true },
        samples  : { value:[],   writable:true },
        patterns : { value:null, writable:true },
        song     : { value:null, writable:true },
        voices   : { value:[],   writable:true },
        complete : { value:0,    writable:true },
        sampFlag : { value:0,    writable:true },

        initialize: {
          value: function() {
            var i, len, voice = this.voices[3];
            this.reset();

            this.song  = this.songs[this.playSong];
            this.speed = this.song.speed;

            this.complete = 15;

            while (voice) {
              voice.initialize();
              voice.channel = this.mixer.channels[voice.index];
              voice.patternPos = this.song.tracks[voice.index][0];

              i = voice.synth;
              len = i + 64;
              for (; i < len; ++i) this.mixer.memory[i] = 0;

              voice = voice.next;
            }
        }},
        loader: {
          value: function(stream) {
            var basePtr, dataPtr, i, j, len, pos, ptr, sample, size, song, tracksLen, value;

            while (stream.position < 16) {
              value = stream.readUshort();
              stream.position += 2;
              if (value != 0x4efa) return;                                            //jmp
            }

            while (stream.position < 1024) {
              value = stream.readUshort();

              if (value == 0x123a) {                                                  //move.b $x,d1
                stream.position += 2;
                value = stream.readUshort();

                if (value == 0xb001) {                                                //cmp.b d1,d0
                  stream.position -= 4;
                  dataPtr = (stream.position + stream.readUshort()) - 0x895;
                }
              } else if (value == 0x214a) {                                           //move.l a2,(a0)
                stream.position += 2;
                value = stream.readUshort();

                if (value == 0x47fa) {                                                //lea $x,a3
                  basePtr = stream.position + stream.readShort();
                  this.version = 1;
                  break;
                }
              }
            }

            if (!this.version) return;

            stream.position = dataPtr + 0x8a2;
            pos = stream.readUint();
            stream.position = basePtr + pos;
            this.samples = [];
            pos = 0x7fffffff;

            while (pos > stream.position) {
              value = stream.readUint();

              if (value) {
                if ((value < stream.position) || (value >= stream.length)) {
                  stream.position -= 4;
                  break;
                }

                if (value < pos) pos = basePtr + value;
              }

              sample = FESample();
              sample.pointer  = value;
              sample.loopPtr  = stream.readShort();
              sample.length   = stream.readUshort() << 1;
              sample.relative = stream.readUshort();

              sample.vibratoDelay = stream.readUbyte();
              stream.position++;
              sample.vibratoSpeed = stream.readUbyte();
              sample.vibratoDepth = stream.readUbyte();
              sample.envelopeVol  = stream.readUbyte();
              sample.attackSpeed  = stream.readUbyte();
              sample.attackVol    = stream.readUbyte();
              sample.decaySpeed   = stream.readUbyte();
              sample.decayVol     = stream.readUbyte();
              sample.sustainTime  = stream.readUbyte();
              sample.releaseSpeed = stream.readUbyte();
              sample.releaseVol   = stream.readUbyte();

              sample.arpeggio = new Int8Array(16);
              for (i = 0; i < 16; ++i) sample.arpeggio[i] = stream.readByte();

              sample.arpeggioSpeed = stream.readUbyte();
              sample.type          = stream.readByte();
              sample.pulseRateNeg  = stream.readByte();
              sample.pulseRatePos  = stream.readUbyte();
              sample.pulseSpeed    = stream.readUbyte();
              sample.pulsePosL     = stream.readUbyte();
              sample.pulsePosH     = stream.readUbyte();
              sample.pulseDelay    = stream.readUbyte();
              sample.synchro       = stream.readUbyte();
              sample.blendRate     = stream.readUbyte();
              sample.blendDelay    = stream.readUbyte();
              sample.pulseCounter  = stream.readUbyte();
              sample.blendCounter  = stream.readUbyte();
              sample.arpeggioLimit = stream.readUbyte();

              stream.position += 12;
              this.samples.push(sample);
              if (!stream.bytesAvailable) break;
            }

            if (pos != 0x7fffffff) {
              this.mixer.store(stream, stream.length - pos);
              len = this.samples.length;

              for (i = 0; i < len; ++i) {
                sample = this.samples[i];
                if (sample.pointer) sample.pointer -= (basePtr + pos);
              }
            }

            pos = this.mixer.memory.length;
            this.mixer.memory.length += 256;
            this.mixer.loopLen = 100;

            for (i = 0; i < 4; ++i) {
              this.voices[i].synth = pos;
              pos += 64;
            }

            stream.position = dataPtr + 0x8a2;
            len = stream.readUint();
            pos = stream.readUint();
            stream.position = basePtr + pos;
            this.patterns = ByteArray(new ArrayBuffer((len - pos)));
            stream.readBytes(this.patterns, 0, (len - pos));
            pos += basePtr;

            stream.position = dataPtr + 0x895;
            this.lastSong = len = stream.readUbyte();

            this.songs = [];
            this.songs.length = ++len;
            basePtr = dataPtr + 0xb0e;
            tracksLen = pos - basePtr;
            pos = 0;

            for (i = 0; i < len; ++i) {
              song = FESong();
              song.tracks = [];

              for (j = 0; j < 4; ++j) {
                stream.position = basePtr + pos;
                value = stream.readUshort();

                if (j == 3 && (i == (len - 1))) size = tracksLen;
                  else size = stream.readUshort();

                size = (size - value) >> 1;
                if (size > song.length) song.length = size;

                song.tracks[j] = new Uint32Array(size);
                stream.position = basePtr + value;

                for (ptr = 0; ptr < size; ++ptr)
                  song.tracks[j][ptr] = stream.readUshort();

                pos += 2;
              }

              stream.position = dataPtr + 0x897 + i;
              song.speed = stream.readUbyte();
              this.songs[i] = song;
            }

            stream.clear();
            stream = null;
        }},
        process: {
          value: function() {
            var chan, i, j, len, loop, pos, sample, value, voice = this.voices[3];

            while (voice) {
              chan = voice.channel;
              loop = 0;

              do {
                this.patterns.position = voice.patternPos;
                sample = voice.sample;
                this.sampFlag = 0;

                if (!voice.busy) {
                  voice.busy = 1;

                  if (sample.loopPtr == 0) {
                    chan.pointer = this.mixer.loopPtr;
                    chan.length  = this.mixer.loopLen;
                  } else if (sample.loopPtr > 0) {
                    chan.pointer = (sample.type) ? voice.synth : sample.pointer + sample.loopPtr;
                    chan.length  = sample.length - sample.loopPtr;
                  }
                }

                if (--voice.tick == 0) {
                  loop = 2;

                  while (loop > 1) {
                    value = this.patterns.readByte();

                    if (value < 0) {
                      switch (value) {
                        case -125:
                          voice.sample = sample = this.samples[this.patterns.readUbyte()];
                          this.sampFlag = 1;
                          voice.patternPos = this.patterns.position;
                          break;
                        case -126:
                          this.speed = this.patterns.readUbyte();
                          voice.patternPos = this.patterns.position;
                          break;
                        case -127:
                          value = (sample) ? sample.relative : 428;
                          voice.portaSpeed = this.patterns.readUbyte() * this.speed;
                          voice.portaNote  = this.patterns.readUbyte();
                          voice.portaLimit = (PERIODS[voice.portaNote] * value) >> 10;
                          voice.portamento = 0;
                          voice.portaDelay = this.patterns.readUbyte() * this.speed;
                          voice.portaFlag  = 1;
                          voice.patternPos = this.patterns.position;
                          break;
                        case -124:
                          chan.enabled = 0;
                          voice.tick = this.speed;
                          voice.busy = 1;
                          voice.patternPos = this.patterns.position;
                          loop = 0;
                          break;
                        case -128:
                          voice.trackPos++;

                          while (1) {
                            value = this.song.tracks[voice.index][voice.trackPos];

                            if (value == 65535) {
                              this.mixer.complete = 1;
                            } else if (value > 32767) {
                              voice.trackPos = (value ^ 32768) >> 1;

                              if (!this.loopSong) {
                                this.complete &= ~(voice.bitFlag);
                                if (!this.complete) this.mixer.complete = 1;
                              }
                            } else {
                              voice.patternPos = value;
                              voice.tick = 1;
                              loop = 1;
                              break;
                            }
                          }
                          break;
                        default:
                          voice.tick = this.speed * -value;
                          voice.patternPos = this.patterns.position;
                          loop = 0;
                          break;
                      }
                    } else {
                      loop = 0;
                      voice.patternPos = this.patterns.position;

                      voice.note = value;
                      voice.arpeggioPos =  0;
                      voice.vibratoFlag = -1;
                      voice.vibrato     =  0;

                      voice.arpeggioSpeed = sample.arpeggioSpeed;
                      voice.vibratoDelay  = sample.vibratoDelay;
                      voice.vibratoSpeed  = sample.vibratoSpeed;
                      voice.vibratoDepth  = sample.vibratoDepth;

                      if (sample.type == 1) {
                        if (this.sampFlag || (sample.synchro & 2)) {
                          voice.pulseCounter = sample.pulseCounter;
                          voice.pulseDelay = sample.pulseDelay;
                          voice.pulseDir = 0;
                          voice.pulsePos = sample.pulsePosL;
                          voice.pulseSpeed = sample.pulseSpeed;

                          i = voice.synth;
                          len = i + sample.pulsePosL;
                          for (; i < len; ++i) this.mixer.memory[i] = sample.pulseRateNeg;
                          len += (sample.length - sample.pulsePosL);
                          for (; i < len; ++i) this.mixer.memory[i] = sample.pulseRatePos;
                        }

                        chan.pointer = voice.synth;
                      } else if (sample.type == 2) {
                        voice.blendCounter = sample.blendCounter;
                        voice.blendDelay = sample.blendDelay;
                        voice.blendDir = 0;
                        voice.blendPos = 1;

                        i = sample.pointer;
                        j = voice.synth;
                        len = i + 31;
                        for (; i < len; ++i) this.mixer.memory[j++] = this.mixer.memory[i];

                        chan.pointer = voice.synth;
                      } else {
                        chan.pointer = sample.pointer;
                      }

                      voice.tick = this.speed;
                      voice.busy = 0;
                      voice.period = (PERIODS[voice.note] * sample.relative) >> 10;

                      voice.volume = 0;
                      voice.envelopePos = 0;
                      voice.sustainTime = sample.sustainTime;

                      chan.length  = sample.length;
                      chan.period  = voice.period;
                      chan.volume  = 0;
                      chan.enabled = 1;

                      if (voice.portaFlag) {
                        if (!voice.portamento) {
                          voice.portamento   = voice.period;
                          voice.portaCounter = 1;
                          voice.portaPeriod  = voice.portaLimit - voice.period;
                        }
                      }
                    }
                  }
                } else if (voice.tick == 1) {
                  value = (this.patterns.readAt(voice.patternPos) - 160) & 255;
                  if (value > 127) chan.enabled = 0;
                }
              } while (loop > 0);

              if (!chan.enabled) {
                voice = voice.next;
                continue;
              }

              value = voice.note + sample.arpeggio[voice.arpeggioPos];

              if (--voice.arpeggioSpeed == 0) {
                voice.arpeggioSpeed = sample.arpeggioSpeed;

                if (++voice.arpeggioPos == sample.arpeggioLimit)
                  voice.arpeggioPos = 0;
              }

              voice.period = (PERIODS[value] * sample.relative) >> 10;

              if (voice.portaFlag) {
                if (voice.portaDelay) {
                  voice.portaDelay--;
                } else {
                  voice.period += ((voice.portaCounter * voice.portaPeriod) / voice.portaSpeed);

                  if (++voice.portaCounter > voice.portaSpeed) {
                    voice.note = voice.portaNote;
                    voice.portaFlag = 0;
                  }
                }
              }

              if (voice.vibratoDelay) {
                voice.vibratoDelay--;
              } else {
                if (voice.vibratoFlag) {
                  if (voice.vibratoFlag < 0) {
                    voice.vibrato += voice.vibratoSpeed;

                    if (voice.vibrato == voice.vibratoDepth)
                      voice.vibratoFlag ^= 0x80000000;
                  } else {
                    voice.vibrato -= voice.vibratoSpeed;

                    if (voice.vibrato == 0)
                      voice.vibratoFlag ^= 0x80000000;
                  }

                  if (voice.vibrato == 0) voice.vibratoFlag ^= 1;

                  if (voice.vibratoFlag & 1) {
                    voice.period += voice.vibrato;
                  } else {
                    voice.period -= voice.vibrato;
                  }
                }
              }

              chan.period = voice.period;

              switch (voice.envelopePos) {
                case 4: break;
                case 0:
                  voice.volume += sample.attackSpeed;

                  if (voice.volume >= sample.attackVol) {
                    voice.volume = sample.attackVol;
                    voice.envelopePos = 1;
                  }
                  break;
                case 1:
                  voice.volume -= sample.decaySpeed;

                  if (voice.volume <= sample.decayVol) {
                    voice.volume = sample.decayVol;
                    voice.envelopePos = 2;
                  }
                  break;
                case 2:
                  if (voice.sustainTime) {
                    voice.sustainTime--;
                  } else {
                    voice.envelopePos = 3;
                  }
                  break;
                case 3:
                  voice.volume -= sample.releaseSpeed;

                  if (voice.volume <= sample.releaseVol) {
                    voice.volume = sample.releaseVol;
                    voice.envelopePos = 4;
                  }
                  break;
              }

              value = sample.envelopeVol << 12;
              value >>= 8;
              value >>= 4;
              value *= voice.volume;
              value >>= 8;
              value >>= 1;
              chan.volume = value;

              if (sample.type == 1) {
                if (voice.pulseDelay) {
                  voice.pulseDelay--;
                } else {
                  if (voice.pulseSpeed) {
                    voice.pulseSpeed--;
                  } else {
                    if (voice.pulseCounter || !(sample.synchro & 1)) {
                      voice.pulseSpeed = sample.pulseSpeed;

                      if (voice.pulseDir & 4) {
                        while (1) {
                          if (voice.pulsePos >= sample.pulsePosL) {
                            loop = 1;
                            break;
                          }

                          voice.pulseDir &= -5;
                          voice.pulsePos++;
                          voice.pulseCounter--;

                          if (voice.pulsePos <= sample.pulsePosH) {
                            loop = 2;
                            break;
                          }

                          voice.pulseDir |= 4;
                          voice.pulsePos--;
                          voice.pulseCounter--;
                        }
                      } else {
                        while (1) {
                          if (voice.pulsePos <= sample.pulsePosH) {
                            loop = 2;
                            break;
                          }

                          voice.pulseDir |= 4;
                          voice.pulsePos--;
                          voice.pulseCounter--;

                          if (voice.pulsePos >= sample.pulsePosL) {
                            loop = 1;
                            break;
                          }

                          voice.pulseDir &= -5;
                          voice.pulsePos++;
                          voice.pulseCounter++;
                        }
                      }

                      pos = voice.synth + voice.pulsePos;

                      if (loop == 1) {
                        this.mixer.memory[pos] = sample.pulseRatePos;
                        voice.pulsePos--;
                      } else {
                        this.mixer.memory[pos] = sample.pulseRateNeg;
                        voice.pulsePos++;
                      }
                    }
                  }
                }
              } else if (sample.type == 2) {
                if (voice.blendDelay) {
                  voice.blendDelay--;
                } else {
                  if (voice.blendCounter || !(sample.synchro & 4)) {
                    if (voice.blendDir) {
                      if (voice.blendPos != 1) {
                        voice.blendPos--;
                      } else {
                        voice.blendDir ^= 1;
                        voice.blendCounter--;
                      }
                    } else {
                      if (voice.blendPos != (sample.blendRate << 1)) {
                        voice.blendPos++;
                      } else {
                        voice.blendDir ^= 1;
                        voice.blendCounter--;
                      }
                    }

                    i = sample.pointer;
                    j = voice.synth;
                    len = i + 31;
                    pos = len + 1;

                    for (; i < len; ++i) {
                      value = (voice.blendPos * this.mixer.memory[pos++]) >> sample.blendRate;
                      this.mixer.memory[pos++] = value + this.mixer.memory[i];
                    }
                  }
                }
              }

              voice = voice.next;
            }
        }}
      });

      o.voices[3] = FEVoice(3,8);
      o.voices[3].next = o.voices[2] = FEVoice(2,4);
      o.voices[2].next = o.voices[1] = FEVoice(1,2);
      o.voices[1].next = o.voices[0] = FEVoice(0,1);

      return Object.seal(o);
    }

    var PERIODS = [
          8192,7728,7296,6888,6504,6136,5792,5464,5160,
          4872,4600,4336,4096,3864,3648,3444,3252,3068,
          2896,2732,2580,2436,2300,2168,2048,1932,1824,
          1722,1626,1534,1448,1366,1290,1218,1150,1084,
          1024, 966, 912, 861, 813, 767, 724, 683, 645,
           609, 575, 542, 512, 483, 456, 430, 406, 383,
           362, 341, 322, 304, 287, 271, 256, 241, 228,
           215, 203, 191, 181, 170, 161, 152, 143, 135];

    window.neoart.FEPlayer = FEPlayer;
  })();
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
  (function() {
    function FXVoice(idx) {
      return Object.create(null, {
        index       : { value:idx,  writable:true },
        next        : { value:null, writable:true },
        channel     : { value:null, writable:true },
        sample      : { value:null, writable:true },
        enabled     : { value:0,    writable:true },
        period      : { value:0,    writable:true },
        effect      : { value:0,    writable:true },
        param       : { value:0,    writable:true },
        volume      : { value:0,    writable:true },
        last        : { value:0,    writable:true },
        slideCtr    : { value:0,    writable:true },
        slideDir    : { value:0,    writable:true },
        slideParam  : { value:0,    writable:true },
        slidePeriod : { value:0,    writable:true },
        slideSpeed  : { value:0,    writable:true },
        stepPeriod  : { value:0,    writable:true },
        stepSpeed   : { value:0,    writable:true },
        stepWanted  : { value:0,    writable:true },

        initialize: {
          value: function() {
            this.channel     = null;
            this.sample      = null;
            this.enabled     = 0;
            this.period      = 0;
            this.effect      = 0;
            this.param       = 0;
            this.volume      = 0;
            this.last        = 0;
            this.slideCtr    = 0;
            this.slideDir    = 0;
            this.slideParam  = 0;
            this.slidePeriod = 0;
            this.slideSpeed  = 0;
            this.stepPeriod  = 0;
            this.stepSpeed   = 0;
            this.stepWanted  = 0;
        }}
      });
    }
    function FXPlayer(mixer) {
      var o = AmigaPlayer(mixer);

      Object.defineProperties(o, {
        id         : { value:"FXPlayer" },
        standard   : { value:0,    writable:true },
        track      : { value:null, writable:true },
        patterns   : { value:[],   writable:true },
        samples    : { value:[],   writable:true },
        length     : { value:0,    writable:true },
        voices     : { value:[],   writable:true },
        trackPos   : { value:0,    writable:true },
        patternPos : { value:0,    writable:true },
        jumpFlag   : { value:0,    writable:true },
        delphine   : { value:0,    writable:true },

        force: {
          set: function(value) {
            if (value < SOUNDFX_10)
              value = SOUNDFX_10;
            else if (value > SOUNDFX_20)
              value = SOUNDFX_20;

            this.version = value;
        }},
        ntsc: {
          set: function(value) {
            this.standard = value;
            this.frequency(value);

            value = (value) ? 20.44952532 : 20.637767904;
            value = (value * (this.sampleRate / 1000)) / 120;
            this.mixer.samplesTick = ((this.tempo / 122) * value) >> 0;
        }},

        initialize: {
          value: function() {
            var voice = this.voices[0];
            this.reset();
            this.ntsc = this.standard;

            this.speed      = 6;
            this.trackPos   = 0;
            this.patternPos = 0;
            this.jumpFlag   = 0;

            while (voice) {
              voice.initialize();
              voice.channel = this.mixer.channels[voice.index];
              voice.sample  = this.samples[0];
              voice = voice.next;
            }
        }},
        loader: {
          value: function(stream) {
            var higher = 0, i, id, j, len, offset, row, sample, size = 0, value;
            if (stream.length < 1686) return;

            stream.position = 60;
            id = stream.readString(4);

            if (id != "SONG") {
              stream.position = 124;
              id = stream.readString(4);
              if (id != "SO31") return;
              if (stream.length < 2350) return;

              offset = 544;
              this.samples.length = len = 32;
              this.version = SOUNDFX_20;
            } else {
              offset = 0;
              this.samples.length = len = 16;
              this.version = SOUNDFX_10;
            }

            this.tempo = stream.readUshort();
            stream.position = 0;

            for (i = 1; i < len; ++i) {
              value = stream.readUint();

              if (value) {
                sample = AmigaSample();
                sample.pointer = size;
                size += value;
                this.samples[i] = sample;
              } else {
                this.samples[i] = null;
              }
            }
            stream.position += 20;

            for (i = 1; i < len; ++i) {
              sample = this.samples[i];
              if (!sample) {
                stream.position += 30;
                continue;
              }

              sample.name   = stream.readString(22);
              sample.length = stream.readUshort() << 1;
              sample.volume = stream.readUshort();
              sample.loop   = stream.readUshort();
              sample.repeat = stream.readUshort() << 1;
            }

            stream.position = 530 + offset;
            this.length = len = stream.readUbyte();
            stream.position++;

            for (i = 0; i < len; ++i) {
              value = stream.readUbyte() << 8;
              this.track[i] = value;
              if (value > higher) higher = value;
            }

            if (offset) offset += 4;
            stream.position = 660 + offset;
            higher += 256;
            this.patterns.length = higher;

            len = this.samples.length;

            for (i = 0; i < higher; ++i) {
              row = AmigaRow();
              row.note   = stream.readShort();
              value      = stream.readUbyte();
              row.param  = stream.readUbyte();
              row.effect = value & 0x0f;
              row.sample = value >> 4;

              this.patterns[i] = row;

              if (this.version == SOUNDFX_20) {
                if (row.note & 0x1000) {
                  row.sample += 16;
                  if (row.note > 0) row.note &= 0xefff;
                }
              } else {
                if (row.effect == 9 || row.note > 856)
                  this.version = SOUNDFX_18;

                if (row.note < -3)
                  this.version = SOUNDFX_19;
              }
              if (row.sample >= len || this.samples[row.sample] == null) row.sample = 0;
            }

            this.mixer.store(stream, size);

            for (i = 1; i < len; ++i) {
              sample = this.samples[i];
              if (!sample) continue;

              if (sample.loop) {
                sample.loopPtr = sample.pointer + sample.loop;
              } else {
                sample.loopPtr = this.mixer.memory.length;
                sample.repeat  = 2;
              }
              size = sample.pointer + 4;
              for (j = sample.pointer; j < size; ++j) this.mixer.memory[j] = 0;
            }

            sample = AmigaSample();
            sample.pointer = sample.loopPtr = this.mixer.memory.length;
            sample.length  = sample.repeat  = 2;
            this.samples[0] = sample;

            stream.position = higher = this.delphine = 0;
            for (i = 0; i < 265; ++i) higher += stream.readUshort();

            switch (higher) {
              case 172662:
              case 1391423:
              case 1458300:
              case 1706977:
              case 1920077:
              case 1920694:
              case 1677853:
              case 1931956:
              case 1926836:
              case 1385071:
              case 1720635:
              case 1714491:
              case 1731874:
              case 1437490:
                this.delphine = 1;
                break;
            }
        }},
        process: {
          value: function() {
            var chan, index, period, row, sample, value, voice = this.voices[0];

            if (!this.tick) {
              value = this.track[this.trackPos] + this.patternPos;

              while (voice) {
                chan = voice.channel;
                voice.enabled = 0;

                row = this.patterns[value + voice.index];
                voice.period = row.note;
                voice.effect = row.effect;
                voice.param  = row.param;

                if (row.note == -3) {
                  voice.effect = 0;
                  voice = voice.next;
                  continue;
                }

                if (row.sample) {
                  sample = voice.sample = this.samples[row.sample];
                  voice.volume = sample.volume;

                  if (voice.effect == 5)
                    voice.volume += voice.param;
                  else if (voice.effect == 6)
                    voice.volume -= voice.param;

                  chan.volume = voice.volume;
                } else {
                  sample = voice.sample;
                }

                if (voice.period) {
                  voice.last = voice.period;
                  voice.slideSpeed = 0;
                  voice.stepSpeed  = 0;

                  voice.enabled = 1;
                  chan.enabled  = 0;

                  switch (voice.period) {
                    case -2:
                      chan.volume = 0;
                      break;
                    case -4:
                      this.jumpFlag = 1;
                      break;
                    case -5:
                      break;
                    default:
                      chan.pointer = sample.pointer;
                      chan.length  = sample.length;

                      if (this.delphine) chan.period = voice.period << 1;
                        else chan.period  = voice.period;
                      break;
                  }

                  if (voice.enabled) chan.enabled = 1;
                  chan.pointer = sample.loopPtr;
                  chan.length  = sample.repeat;
                }
                voice = voice.next;
              }
            } else {
              while (voice) {
                chan = voice.channel;

                if (this.version == SOUNDFX_18 && voice.period == -3) {
                  voice = voice.next;
                  continue;
                }

                if (voice.stepSpeed) {
                  voice.stepPeriod += voice.stepSpeed;

                  if (voice.stepSpeed < 0) {
                    if (voice.stepPeriod < voice.stepWanted) {
                      voice.stepPeriod = voice.stepWanted;
                      if (this.version > SOUNDFX_18) voice.stepSpeed = 0;
                    }
                  } else {
                    if (voice.stepPeriod > voice.stepWanted) {
                      voice.stepPeriod = voice.stepWanted;
                      if (this.version > SOUNDFX_18) voice.stepSpeed = 0;
                    }
                  }

                  if (this.version > SOUNDFX_18) voice.last = voice.stepPeriod;
                  chan.period = voice.stepPeriod;
                } else {
                  if (voice.slideSpeed) {
                    value = voice.slideParam & 0x0f;

                    if (value) {
                      if (++voice.slideCtr == value) {
                        voice.slideCtr = 0;
                        value = (voice.slideParam << 4) << 3;

                        if (!voice.slideDir) {
                          voice.slidePeriod += 8;
                          chan.period = voice.slidePeriod;
                          value += voice.slideSpeed;
                          if (value == voice.slidePeriod) voice.slideDir = 1;
                        } else {
                          voice.slidePeriod -= 8;
                          chan.period = voice.slidePeriod;
                          value -= voice.slideSpeed;
                          if (value == voice.slidePeriod) voice.slideDir = 0;
                        }
                      } else {
                        voice = voice.next;
                        continue;
                      }
                    }
                  }

                  value = 0;

                  switch (voice.effect) {
                    case 0:
                      break;
                    case 1:   //arpeggio
                      value = this.tick % 3;
                      index = 0;

                      if (value == 2) {
                        chan.period = voice.last;
                        voice = voice.next;
                        continue;
                      }

                      if (value == 1) value = voice.param & 0x0f;
                        else value = voice.param >> 4;

                      while (voice.last != PERIODS[index]) index++;
                      chan.period = PERIODS[index + value];
                      break;
                    case 2:   //pitchbend
                      value = voice.param >> 4;
                      if (value) voice.period += value;
                        else voice.period -= voice.param & 0x0f;
                      chan.period = voice.period;
                      break;
                    case 3:   //filter on
                      this.mixer.filter.active = 1;
                      break;
                    case 4:   //filter off
                      this.mixer.filter.active = 0;
                      break;
                    case 8:   //step down
                      value = -1;
                    case 7:   //step up
                      voice.stepSpeed  = voice.param & 0x0f;
                      voice.stepPeriod = this.version > SOUNDFX_18 ? voice.last : voice.period;
                      if (value < 0) voice.stepSpeed = -voice.stepSpeed;
                      index = 0;

                      while (true) {
                        period = PERIODS[index];
                        if (period == voice.stepPeriod) break;
                        if (period < 0) {
                          index = -1;
                          break;
                        } else
                          index++;
                      }

                      if (index > -1) {
                        period = voice.param >> 4;
                        if (value > -1) period = -period;
                        index += period;
                        if (index < 0) index = 0;
                        voice.stepWanted = PERIODS[index];
                      } else
                        voice.stepWanted = voice.period;
                      break;
                    case 9:   //auto slide
                      voice.slideSpeed = voice.slidePeriod = voice.period;
                      voice.slideParam = voice.param;
                      voice.slideDir = 0;
                      voice.slideCtr = 0;
                      break;
                  }
                }
                voice = voice.next;
              }
            }

            if (++this.tick == this.speed) {
              this.tick = 0;
              this.patternPos += 4;

              if (this.patternPos == 256 || this.jumpFlag) {
                this.patternPos = this.jumpFlag = 0;

                if (++this.trackPos == this.length) {
                  this.trackPos = 0;
                  this.mixer.complete = 1;
                }
              }
            }
        }}
      });

      o.voices[0] = FXVoice(0);
      o.voices[0].next = o.voices[1] = FXVoice(1);
      o.voices[1].next = o.voices[2] = FXVoice(2);
      o.voices[2].next = o.voices[3] = FXVoice(3);

      o.track = new Uint16Array(128);
      return Object.seal(o);
    }

    var SOUNDFX_10 = 1,
        SOUNDFX_18 = 2,
        SOUNDFX_19 = 3,
        SOUNDFX_20 = 4,

        PERIODS = [
          1076,1016,960,906,856,808,762,720,678,640,604,570,
           538, 508,480,453,428,404,381,360,339,320,302,285,
           269, 254,240,226,214,202,190,180,170,160,151,143,
           135, 127,120,113,113,113,113,113,113,113,113,113,
           113, 113,113,113,113,113,113,113,113,113,113,113,
           113, 113,113,113,113,113,-1];

    window.neoart.FXPlayer = FXPlayer;
  })();
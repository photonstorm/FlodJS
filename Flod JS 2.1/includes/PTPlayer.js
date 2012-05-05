/*
  Flod JS 2.1
  2012/04/30
  Christian Corti
  Neoart Costa Rica

  Last Update: Flod JS 2.1 - 2012/04/16

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
  OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
  LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR
  IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

  This work is licensed under the Creative Commons Attribution-Noncommercial-Share Alike 3.0 Unported License.
  To view a copy of this license, visit http://creativecommons.org/licenses/by-nc-sa/3.0/ or send a letter to
  Creative Commons, 171 Second Street, Suite 300, San Francisco, California, 94105, USA.
*/
  (function() {
    function PTVoice(idx) {
      return Object.create(null, {
        index        : { value:idx,  writable:true },
        next         : { value:null, writable:true },
        channel      : { value:null, writable:true },
        sample       : { value:null, writable:true },
        enabled      : { value:0,    writable:true },
        loopCtr      : { value:0,    writable:true },
        loopPos      : { value:0,    writable:true },
        step         : { value:0,    writable:true },
        period       : { value:0,    writable:true },
        effect       : { value:0,    writable:true },
        param        : { value:0,    writable:true },
        volume       : { value:0,    writable:true },
        pointer      : { value:0,    writable:true },
        length       : { value:0,    writable:true },
        loopPtr      : { value:0,    writable:true },
        repeat       : { value:0,    writable:true },
        finetune     : { value:0,    writable:true },
        offset       : { value:0,    writable:true },
        portaDir     : { value:0,    writable:true },
        portaPeriod  : { value:0,    writable:true },
        portaSpeed   : { value:0,    writable:true },
        glissando    : { value:0,    writable:true },
        tremoloParam : { value:0,    writable:true },
        tremoloPos   : { value:0,    writable:true },
        tremoloWave  : { value:0,    writable:true },
        vibratoParam : { value:0,    writable:true },
        vibratoPos   : { value:0,    writable:true },
        vibratoWave  : { value:0,    writable:true },
        funkPos      : { value:0,    writable:true },
        funkSpeed    : { value:0,    writable:true },
        funkWave     : { value:0,    writable:true },

        initialize: {
          value: function() {
            this.channel      = null;
            this.sample       = null;
            this.enabled      = 0;
            this.loopCtr      = 0;
            this.loopPos      = 0;
            this.step         = 0;
            this.period       = 0;
            this.effect       = 0;
            this.param        = 0;
            this.volume       = 0;
            this.pointer      = 0;
            this.length       = 0;
            this.loopPtr      = 0;
            this.repeat       = 0;
            this.finetune     = 0;
            this.offset       = 0;
            this.portaDir     = 0;
            this.portaPeriod  = 0;
            this.portaSpeed   = 0;
            this.glissando    = 0;
            this.tremoloParam = 0;
            this.tremoloPos   = 0;
            this.tremoloWave  = 0;
            this.vibratoParam = 0;
            this.vibratoPos   = 0;
            this.vibratoWave  = 0;
            this.funkPos      = 0;
            this.funkSpeed    = 0;
            this.funkWave     = 0;
        }}
      });
    }
    function PTRow() {
      var o = AmigaRow();

      Object.defineProperties(o, {
        step: { value:0, writable:true }
      });

      return Object.seal(o);
    }
    function PTSample() {
      var o = AmigaSample();

      Object.defineProperties(o, {
        finetune : { value:0, writable:true },
        realLen  : { value:0, writable:true }
      });

      return Object.seal(o);
    }
    function PTPlayer(mixer) {
      var o = AmigaPlayer(mixer);

      Object.defineProperties(o, {
        id           : { value:"PTPlayer" },
        track        : { value:null, writable:true },
        patterns     : { value:[],   writable:true },
        samples      : { value:[],   writable:true },
        length       : { value:0,    writable:true },
        voices       : { value:[],   writable:true },
        trackPos     : { value:0,    writable:true },
        patternPos   : { value:0,    writable:true },
        patternBreak : { value:0,    writable:true },
        patternDelay : { value:0,    writable:true },
        breakPos     : { value:0,    writable:true },
        jumpFlag     : { value:0,    writable:true },
        vibratoDepth : { value:0,    writable:true },

        force: {
          set: function(value) {
            if (value < PROTRACKER_10)
              value = PROTRACKER_10;
            else if (value > PROTRACKER_12)
              value = PROTRACKER_12;

            this.version = value;

            if (value < PROTRACKER_11) this.vibratoDepth = 6;
              else this.vibratoDepth = 7;
        }},

        initialize: {
          value: function() {
            var voice = this.voices[0];

            this.tempo        = 125;
            this.speed        = 6;
            this.trackPos     = 0;
            this.patternPos   = 0;
            this.patternBreak = 0;
            this.patternDelay = 0;
            this.breakPos     = 0;
            this.jumpFlag     = 0;

            this.reset();
            this.force = this.version;

            while (voice) {
              voice.initialize();
              voice.channel = this.mixer.channels[voice.index];
              voice.sample  = this.samples[0];
              voice = voice.next;
            }
        }},
        loader: {
          value: function(stream) {
            var higher = 0, i, id, j, row, sample, size = 0, value;
            if (stream.length < 2106) return;

            stream.position = 1080;
            id = stream.readString(4);
            if (id != "M.K." && id != "M!K!") return;

            stream.position = 0;
            this.title = stream.readString(20);
            this.version = PROTRACKER_10;
            stream.position += 22;

            for (i = 1; i < 32; ++i) {
              value = stream.readUshort();

              if (!value) {
                this.samples[i] = null;
                stream.position += 28;
                continue;
              }

              sample = PTSample();
              stream.position -= 24;

              sample.name = stream.readString(22);
              sample.length = sample.realLen = value << 1;
              stream.position += 2;

              sample.finetune = stream.readUbyte() * 37;
              sample.volume   = stream.readUbyte();
              sample.loop     = stream.readUshort() << 1;
              sample.repeat   = stream.readUshort() << 1;

              stream.position += 22;
              sample.pointer = size;
              size += sample.length;
              this.samples[i] = sample;
            }

            stream.position = 950;
            this.length = stream.readUbyte();
            stream.position++;

            for (i = 0; i < 128; ++i) {
              value = stream.readUbyte() << 8;
              this.track[i] = value;
              if (value > higher) higher = value;
            }

            stream.position = 1084;
            higher += 256;
            this.patterns.length = higher;

            for (i = 0; i < higher; ++i) {
              row = PTRow();
              row.step = value = stream.readUint();

              row.note   = (value >> 16) & 0x0fff;
              row.effect = (value >>  8) & 0x0f;
              row.sample = (value >> 24) & 0xf0 | (value >> 12) & 0x0f;
              row.param  = value & 0xff;

              this.patterns[i] = row;

              if (row.sample > 31 || !this.samples[row.sample]) row.sample = 0;

              if (row.effect == 15 && row.param > 31)
                this.version = PROTRACKER_11;

              if (row.effect == 8)
                this.version = PROTRACKER_12;
            }

            this.mixer.store(stream, size);

            for (i = 1; i < 32; ++i) {
              sample = this.samples[i];
              if (!sample) continue;

              if (sample.loop || sample.repeat > 4) {
                sample.loopPtr = sample.pointer + sample.loop;
                sample.length  = sample.loop + sample.repeat;
              } else {
                sample.loopPtr = this.mixer.memory.length;
                sample.repeat  = 2;
              }
              size = sample.pointer + 2;
              for (j = sample.pointer; j < size; ++j) this.mixer.memory[j] = 0;
            }

            sample = PTSample();
            sample.pointer = sample.loopPtr = this.mixer.memory.length;
            sample.length  = sample.repeat  = 2;
            this.samples[0] = sample;
        }},
        process: {
          value: function() {
            var chan, i, pattern, row, sample, value, voice = this.voices[0];

            if (!this.tick) {
              if (this.patternDelay) {
                this.effects();
              } else {
                pattern = this.track[this.trackPos] + this.patternPos;

                while (voice) {
                  chan = voice.channel;
                  voice.enabled = 0;

                  if (!voice.step) chan.period = voice.period;

                  row = this.patterns[pattern + voice.index];
                  voice.step   = row.step;
                  voice.effect = row.effect;
                  voice.param  = row.param;

                  if (row.sample) {
                    sample = voice.sample = this.samples[row.sample];

                    voice.pointer  = sample.pointer;
                    voice.length   = sample.length;
                    voice.loopPtr  = voice.funkWave = sample.loopPtr;
                    voice.repeat   = sample.repeat;
                    voice.finetune = sample.finetune;

                    chan.volume = voice.volume = sample.volume;
                  } else {
                    sample = voice.sample;
                  }

                  if (!row.note) {
                    this.moreEffects(voice);
                    voice = voice.next;
                    continue;
                  } else {
                    if ((voice.step & 0x0ff0) == 0x0e50) {
                      voice.finetune = (voice.param & 0x0f) * 37;
                    } else if (voice.effect == 3 || voice.effect == 5) {
                      if (row.note == voice.period) {
                        voice.portaPeriod = 0;
                      } else {
                        i = voice.finetune;
                        value = i + 37;

                        for (; i < value; ++i)
                          if (row.note >= PERIODS[i]) break;

                        if (i == value) value--;

                        if (i > 0) {
                          value = ((voice.finetune / 37) >> 0) & 8;
                          if (value) i--;
                        }

                        voice.portaPeriod = PERIODS[i];
                        voice.portaDir = row.note > voice.portaPeriod ? 0 : 1;
                      }
                    } else if (voice.effect == 9) {
                      this.moreEffects(voice);
                    }
                  }

                  for (i = 0; i < 37; ++i)
                    if (row.note >= PERIODS[i]) break;

                  voice.period = PERIODS[voice.finetune + i];

                  if ((voice.step & 0x0ff0) == 0x0ed0) {
                    if (voice.funkSpeed) this.updateFunk(voice);
                    this.extended(voice);
                    voice = voice.next;
                    continue;
                  }

                  if (voice.vibratoWave < 4) voice.vibratoPos = 0;
                  if (voice.tremoloWave < 4) voice.tremoloPos = 0;

                  chan.enabled = 0;
                  chan.pointer = voice.pointer;
                  chan.length  = voice.length;
                  chan.period  = voice.period;

                  voice.enabled = 1;
                  this.moreEffects(voice);
                  voice = voice.next;
                }
                voice = this.voices[0];

                while (voice) {
                  chan = voice.channel;
                  if (voice.enabled) chan.enabled = 1;

                  chan.pointer = voice.loopPtr;
                  chan.length  = voice.repeat;

                  voice = voice.next;
                }
              }
            } else {
              this.effects();
            }

            if (++this.tick == this.speed) {
              this.tick = 0;
              this.patternPos += 4;

              if (this.patternDelay)
                if (--this.patternDelay) this.patternPos -= 4;

              if (this.patternBreak) {
                this.patternBreak = 0;
                this.patternPos = this.breakPos;
                this.breakPos = 0;
              }

              if (this.patternPos == 256 || this.jumpFlag) {
                this.patternPos = this.breakPos;
                this.breakPos = 0;
                this.jumpFlag = 0;

                if (++this.trackPos == this.length) {
                  this.trackPos = 0;
                  this.mixer.complete = 1;
                }
              }
            }
        }},
        effects: {
          value: function() {
            var chan, i, position, slide, value, voice = this.voices[0], wave;

            while (voice) {
              chan = voice.channel;
              if (voice.funkSpeed) this.updateFunk(voice);

              if ((voice.step & 0x0fff) == 0) {
                chan.period = voice.period;
                voice = voice.next;
                continue;
              }

              switch (voice.effect) {
                case 0:   //arpeggio
                  value = this.tick % 3;

                  if (!value) {
                    chan.period = voice.period;
                    voice = voice.next;
                    continue;
                  }

                  if (value == 1) value = voice.param >> 4;
                    else value = voice.param & 0x0f;

                  i = voice.finetune;
                  position = i + 37;

                  for (; i < position; ++i)
                    if (voice.period >= PERIODS[i]) {
                      chan.period = PERIODS[i + value];
                      break;
                    }
                  break;
                case 1:   //portamento up
                  voice.period -= voice.param;
                  if (voice.period < 113) voice.period = 113;
                  chan.period = voice.period;
                  break;
                case 2:   //portamento down
                  voice.period += voice.param;
                  if (voice.period > 856) voice.period = 856;
                  chan.period = voice.period;
                  break;
                case 3:   //tone portamento
                case 5:   //tone portamento + volume slide
                  if (voice.effect == 5) {
                    slide = 1;
                  } else {
                    voice.portaSpeed = voice.param;
                    voice.param = 0;
                  }

                  if (voice.portaPeriod) {
                    if (voice.portaDir) {
                      voice.period -= voice.portaSpeed;

                      if (voice.period <= voice.portaPeriod) {
                        voice.period = voice.portaPeriod;
                        voice.portaPeriod = 0;
                      }
                    } else {
                      voice.period += voice.portaSpeed;

                      if (voice.period >= voice.portaPeriod) {
                        voice.period = voice.portaPeriod;
                        voice.portaPeriod = 0;
                      }
                    }

                    if (voice.glissando) {
                      i = voice.finetune;
                      value = i + 37;

                      for (; i < value; ++i)
                        if (voice.period >= PERIODS[i]) break;

                      if (i == value) i--;
                      chan.period = PERIODS[i];
                    } else {
                      chan.period = voice.period;
                    }
                  }
                  break;
                case 4:   //vibrato
                case 6:   //vibrato + volume slide
                  if (voice.effect == 6) {
                    slide = 1;
                  } else if (voice.param) {
                    value = voice.param & 0x0f;
                    if (value) voice.vibratoParam = (voice.vibratoParam & 0xf0) | value;
                    value = voice.param & 0xf0;
                    if (value) voice.vibratoParam = (voice.vibratoParam & 0x0f) | value;
                  }

                  position = (voice.vibratoPos >> 2) & 31;
                  wave = voice.vibratoWave & 3;

                  if (wave) {
                    value = 255;
                    position <<= 3;

                    if (wave == 1) {
                      if (voice.vibratoPos > 127) value -= position;
                        else value = position;
                    }
                  } else {
                    value = VIBRATO[position];
                  }

                  value = ((voice.vibratoParam & 0x0f) * value) >> this.vibratoDepth;

                  if (voice.vibratoPos > 127) chan.period = voice.period - value;
                    else chan.period = voice.period + value;

                  value = (voice.vibratoParam >> 2) & 60;
                  voice.vibratoPos = (voice.vibratoPos + value) & 255;
                  break;
                case 7:   //tremolo
                  chan.period = voice.period;

                  if (voice.param) {
                    value = voice.param & 0x0f;
                    if (value) voice.tremoloParam = (voice.tremoloParam & 0xf0) | value;
                    value = voice.param & 0xf0;
                    if (value) voice.tremoloParam = (voice.tremoloParam & 0x0f) | value;
                  }

                  position = (voice.tremoloPos >> 2) & 31;
                  wave = voice.tremoloWave & 3;

                  if (wave) {
                    value = 255;
                    position <<= 3;

                    if (wave == 1) {
                      if (voice.tremoloPos > 127) value -= position;
                        else value = position;
                    }
                  } else {
                    value = VIBRATO[position];
                  }

                  value = ((voice.tremoloParam & 0x0f) * value) >> 6;

                  if (voice.tremoloPos > 127) chan.volume = voice.volume - value;
                    else chan.volume = voice.volume + value;

                  value = (voice.tremoloParam >> 2) & 60;
                  voice.tremoloPos = (voice.tremoloPos + value) & 255;
                  break;
                case 10:  //volume slide
                  slide = 1;
                  break;
                case 14:  //extended effects
                  this.extended(voice);
                  break;
              }

              if (slide) {
                slide = 0;
                value = voice.param >> 4;

                if (value) voice.volume += value;
                  else voice.volume -= voice.param & 0x0f;

                if (voice.volume < 0) voice.volume = 0;
                  else if (voice.volume > 64) voice.volume = 64;

                chan.volume = voice.volume;
              }
              voice = voice.next;
            }
        }},
        moreEffects: {
          value: function(voice) {
            var chan = voice.channel, value;
            if (voice.funkSpeed) this.updateFunk(voice);

            switch (voice.effect) {
              case 9:   //sample offset
                if (voice.param) voice.offset = voice.param;
                value = voice.offset << 8;

                if (value >= voice.length) {
                  voice.length = 2;
                } else {
                  voice.pointer += value;
                  voice.length  -= value;
                }
                break;
              case 11:  //position jump
                this.trackPos = voice.param - 1;
                this.breakPos = 0;
                this.jumpFlag = 1;
                break;
              case 12:  //set volume
                voice.volume = voice.param;
                if (voice.volume > 64) voice.volume = 64;
                chan.volume = voice.volume;
                break;
              case 13:  //pattern break
                this.breakPos = ((voice.param >> 4) * 10) + (voice.param & 0x0f);

                if (this.breakPos > 63) this.breakPos = 0;
                  else this.breakPos <<= 2;

                this.jumpFlag = 1;
                break;
              case 14:  //extended effects
                this.extended(voice);
                break;
              case 15:  //set speed
                if (!voice.param) return;

                if (voice.param < 32) this.speed = voice.param;
                  else this.mixer.samplesTick = ((this.sampleRate * 2.5) / voice.param) >> 0;

                this.tick = 0;
                break;
            }
        }},
        extended: {
          value: function(voice) {
            var chan = voice.channel, effect = voice.param >> 4, i, len, memory, param = voice.param & 0x0f;

            switch (effect) {
              case 0:   //set filter
                this.mixer.filter.active = param;
                break;
              case 1:   //fine portamento up
                if (this.tick) return;
                voice.period -= param;
                if (voice.period < 113) voice.period = 113;
                chan.period = voice.period;
                break;
              case 2:   //fine portamento down
                if (this.tick) return;
                voice.period += param;
                if (voice.period > 856) voice.period = 856;
                chan.period = voice.period;
                break;
              case 3:   //glissando control
                voice.glissando = param;
                break;
              case 4:   //vibrato control
                voice.vibratoWave = param;
                break;
              case 5:   //set finetune
                voice.finetune = param * 37;
                break;
              case 6:   //pattern loop
                if (this.tick) return;

                if (param) {
                  if (voice.loopCtr) voice.loopCtr--;
                    else voice.loopCtr = param;

                  if (voice.loopCtr) {
                    this.breakPos = voice.loopPos << 2;
                    this.patternBreak = 1;
                  }
                } else {
                  voice.loopPos = this.patternPos >> 2;
                }
                break;
              case 7:   //tremolo control
                voice.tremoloWave = param;
                break;
              case 8:   //karplus strong
                len = voice.length - 2;
                memory = this.mixer.memory;

                for (i = voice.loopPtr; i < len;)
                  memory[i] = (memory[i] + memory[++i]) * 0.5;

                memory[++i] = (memory[i] + memory[0]) * 0.5;
                break;
              case 9:   //retrig note
                if (this.tick || !param || !voice.period) return;
                if (this.tick % param) return;

                chan.enabled = 0;
                chan.pointer = voice.pointer;
                chan.length  = voice.length;
                chan.delay   = 30;

                chan.enabled = 1;
                chan.pointer = voice.loopPtr;
                chan.length  = voice.repeat;
                chan.period  = voice.period;
                break;
              case 10:  //fine volume up
                if (this.tick) return;
                voice.volume += param;
                if (voice.volume > 64) voice.volume = 64;
                chan.volume = voice.volume;
                break;
              case 11:  //fine volume down
                if (this.tick) return;
                voice.volume -= param;
                if (voice.volume < 0) voice.volume = 0;
                chan.volume = voice.volume;
                break;
              case 12:  //note cut
                if (this.tick == param) chan.volume = voice.volume = 0;
                break;
              case 13:  //note delay
                if (this.tick != param || !voice.period) return;

                chan.enabled = 0;
                chan.pointer = voice.pointer;
                chan.length  = voice.length;
                chan.delay   = 30;

                chan.enabled = 1;
                chan.pointer = voice.loopPtr;
                chan.length  = voice.repeat;
                chan.period  = voice.period;
                break;
              case 14:  //pattern delay
                if (this.tick || this.patternDelay) return;
                this.patternDelay = ++param;
                break;
              case 15:  //funk repeat or invert loop
                if (this.tick) return;
                voice.funkSpeed = param;
                if (param) this.updateFunk(voice);
                break;
            }
        }},
        updateFunk: {
          value: function(voice) {
            var chan = voice.channel, p1, p2, value = FUNKREP[voice.funkSpeed];

            voice.funkPos += value;
            if (voice.funkPos < 128) return;
            voice.funkPos = 0;

            if (this.version == PROTRACKER_10) {
              p1 = voice.pointer + voice.sample.realLen - voice.repeat;
              p2 = voice.funkWave + voice.repeat;

              if (p2 > p1) {
                p2 = voice.loopPtr;
                chan.length = voice.repeat;
              }
              chan.pointer = voice.funkWave = p2;
            } else {
              p1 = voice.loopPtr + voice.repeat;
              p2 = voice.funkWave + 1;

              if (p2 >= p1) p2 = voice.loopPtr;

              this.mixer.memory[p2] = -this.mixer.memory[p2];
            }
        }}
      });

      o.voices[0] = PTVoice(0);
      o.voices[0].next = o.voices[1] = PTVoice(1);
      o.voices[1].next = o.voices[2] = PTVoice(2);
      o.voices[2].next = o.voices[3] = PTVoice(3);

      o.track = new Uint16Array(128);
      return Object.seal(o);
    }

    var PROTRACKER_10 = 1,
        PROTRACKER_11 = 2,
        PROTRACKER_12 = 3,

        PERIODS = [
          856,808,762,720,678,640,604,570,538,508,480,453,
          428,404,381,360,339,320,302,285,269,254,240,226,
          214,202,190,180,170,160,151,143,135,127,120,113,0,
          850,802,757,715,674,637,601,567,535,505,477,450,
          425,401,379,357,337,318,300,284,268,253,239,225,
          213,201,189,179,169,159,150,142,134,126,119,113,0,
          844,796,752,709,670,632,597,563,532,502,474,447,
          422,398,376,355,335,316,298,282,266,251,237,224,
          211,199,188,177,167,158,149,141,133,125,118,112,0,
          838,791,746,704,665,628,592,559,528,498,470,444,
          419,395,373,352,332,314,296,280,264,249,235,222,
          209,198,187,176,166,157,148,140,132,125,118,111,0,
          832,785,741,699,660,623,588,555,524,495,467,441,
          416,392,370,350,330,312,294,278,262,247,233,220,
          208,196,185,175,165,156,147,139,131,124,117,110,0,
          826,779,736,694,655,619,584,551,520,491,463,437,
          413,390,368,347,328,309,292,276,260,245,232,219,
          206,195,184,174,164,155,146,138,130,123,116,109,0,
          820,774,730,689,651,614,580,547,516,487,460,434,
          410,387,365,345,325,307,290,274,258,244,230,217,
          205,193,183,172,163,154,145,137,129,122,115,109,0,
          814,768,725,684,646,610,575,543,513,484,457,431,
          407,384,363,342,323,305,288,272,256,242,228,216,
          204,192,181,171,161,152,144,136,128,121,114,108,0,
          907,856,808,762,720,678,640,604,570,538,508,480,
          453,428,404,381,360,339,320,302,285,269,254,240,
          226,214,202,190,180,170,160,151,143,135,127,120,0,
          900,850,802,757,715,675,636,601,567,535,505,477,
          450,425,401,379,357,337,318,300,284,268,253,238,
          225,212,200,189,179,169,159,150,142,134,126,119,0,
          894,844,796,752,709,670,632,597,563,532,502,474,
          447,422,398,376,355,335,316,298,282,266,251,237,
          223,211,199,188,177,167,158,149,141,133,125,118,0,
          887,838,791,746,704,665,628,592,559,528,498,470,
          444,419,395,373,352,332,314,296,280,264,249,235,
          222,209,198,187,176,166,157,148,140,132,125,118,0,
          881,832,785,741,699,660,623,588,555,524,494,467,
          441,416,392,370,350,330,312,294,278,262,247,233,
          220,208,196,185,175,165,156,147,139,131,123,117,0,
          875,826,779,736,694,655,619,584,551,520,491,463,
          437,413,390,368,347,328,309,292,276,260,245,232,
          219,206,195,184,174,164,155,146,138,130,123,116,0,
          868,820,774,730,689,651,614,580,547,516,487,460,
          434,410,387,365,345,325,307,290,274,258,244,230,
          217,205,193,183,172,163,154,145,137,129,122,115,0,
          862,814,768,725,684,646,610,575,543,513,484,457,
          431,407,384,363,342,323,305,288,272,256,242,228,
          216,203,192,181,171,161,152,144,136,128,121,114,0],

        VIBRATO = [
            0, 24, 49, 74, 97,120,141,161,180,197,212,224,
          235,244,250,253,255,253,250,244,235,224,212,197,
          180,161,141,120, 97, 74, 49, 24],

        FUNKREP = [0,5,6,7,8,10,11,13,16,19,22,26,32,43,64,128];

    window.neoart.PTPlayer = PTPlayer;
  })();
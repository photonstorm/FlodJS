/*
  Flod JS 2.1
  2012/04/30
  Christian Corti
  Neoart Costa Rica

  Last Update: Flod JS 2.1 - 2012/04/17

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
  OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
  LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR
  IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

  This work is licensed under the Creative Commons Attribution-Noncommercial-Share Alike 3.0 Unported License.
  To view a copy of this license, visit http://creativecommons.org/licenses/by-nc-sa/3.0/ or send a letter to
  Creative Commons, 171 Second Street, Suite 300, San Francisco, California, 94105, USA.
*/
  (function() {
    function HMVoice(idx) {
      return Object.create(null, {
        index        : { value:idx,  writable:true },
        next         : { value:null, writable:true },
        channel      : { value:null, writable:true },
        sample       : { value:null, writable:true },
        enabled      : { value:0,    writable:true },
        period       : { value:0,    writable:true },
        effect       : { value:0,    writable:true },
        param        : { value:0,    writable:true },
        volume1      : { value:0,    writable:true },
        volume2      : { value:0,    writable:true },
        handler      : { value:0,    writable:true },
        portaDir     : { value:0,    writable:true },
        portaPeriod  : { value:0,    writable:true },
        portaSpeed   : { value:0,    writable:true },
        vibratoPos   : { value:0,    writable:true },
        vibratoSpeed : { value:0,    writable:true },
        wavePos      : { value:0,    writable:true },

        initialize: {
          value: function() {
            this.channel      = null;
            this.sample       = null;
            this.enabled      = 0;
            this.period       = 0;
            this.effect       = 0;
            this.param        = 0;
            this.volume1      = 0;
            this.volume2      = 0;
            this.handler      = 0;
            this.portaDir     = 0;
            this.portaPeriod  = 0;
            this.portaSpeed   = 0;
            this.vibratoPos   = 0;
            this.vibratoSpeed = 0;
            this.wavePos      = 0;
        }}
      });
    }
    function HMSample() {
      var o = AmigaSample();

      Object.defineProperties(o, {
        finetune : { value:0,    writable:true },
        restart  : { value:0,    writable:true },
        waveLen  : { value:0,    writable:true },
        waves    : { value:null, writable:true },
        volumes  : { value:null, writable:true }
      });

      return Object.seal(o);
    }
    function HMPlayer(mixer) {
      var o = AmigaPlayer(mixer);

      Object.defineProperties(o, {
        id         : { value:"HMPlayer" },
        track      : { value:null, writable:true },
        patterns   : { value:[],   writable:true },
        samples    : { value:[],   writable:true },
        length     : { value:0,    writable:true },
        restart    : { value:0,    writable:true },
        voices     : { value:[],   writable:true },
        trackPos   : { value:0,    writable:true },
        patternPos : { value:0,    writable:true },
        jumpFlag   : { value:0,    writable:true },

        initialize: {
          value: function() {
            var voice = this.voices[0];
            this.reset();

            this.speed      = 6;
            this.trackPos   = 0;
            this.patternPos = 0;
            this.jumpFlag   = 0;

            this.mixer.samplesTick = 884;

            while (voice) {
              voice.initialize();
              voice.channel = this.mixer.channels[voice.index];
              voice.sample  = this.samples[0];
              voice = voice.next;
            }
        }},
        loader: {
          value: function(stream) {
            var count = 0, higher = 0, i, id, j, mupp = 0, position, row, sample, size = 0, value;
            if (stream.length < 2106) return;

            stream.position = 1080;
            id = stream.readString(4);
            if (id != "FEST") return;

            stream.position = 950;
            this.length  = stream.readUbyte();
            this.restart = stream.readUbyte();

            for (i = 0; i < 128; ++i)
              this.track[i] = stream.readUbyte();

            stream.position = 0;
            this.title = stream.readString(20);
            this.version = 1;

            for (i = 1; i < 32; ++i) {
              this.samples[i] = null;
              id = stream.readString(4);

              if (id == "Mupp") {
                value = stream.readUbyte();
                count = value - higher++;
                for (j = 0; j < 128; ++j)
                  if (this.track[j] && this.track[j] >= count) this.track[j]--;

                sample = HMSample();
                sample.name = id;
                sample.length  = sample.repeat = 32;
                sample.restart = stream.readUbyte();
                sample.waveLen = stream.readUbyte();
                stream.position += 17;
                sample.finetune = stream.readByte();
                sample.volume   = stream.readUbyte();

                position = stream.position + 4;
                value = 1084 + (value << 10);
                stream.position = value;

                sample.pointer = this.mixer.memory.length;
                sample.waves   = new Uint16Array(64);
                sample.volumes = new Uint8Array(64);
                this.mixer.store(stream, 896);

                for (j = 0; j < 64; ++j)
                  sample.waves[j] = stream.readUbyte() << 5;
                for (j = 0; j < 64; ++j)
                  sample.volumes[j] = stream.readUbyte() & 127;

                stream.position = value;
                stream.writeInt(0x666c6f64);
                stream.position = position;
                mupp += 896;
              } else {
                id = id.substr(0, 2);
                if (id == "El")
                  stream.position += 18;
                else {
                  stream.position -= 4;
                  id = stream.readString(22);
                }

                value = stream.readUshort();
                if (!value) {
                  stream.position += 6;
                  continue;
                }

                sample = HMSample();
                sample.name = id;
                sample.pointer  = size;
                sample.length   = value << 1;
                sample.finetune = stream.readByte();
                sample.volume   = stream.readUbyte();
                sample.loop     = stream.readUshort() << 1;
                sample.repeat   = stream.readUshort() << 1;
                size += sample.length;
              }
              this.samples[i] = sample;
            }

            for (i = 0; i < 128; ++i) {
              value = this.track[i] << 8;
              this.track[i] = value;
              if (value > higher) higher = value;
            }

            stream.position = 1084;
            higher += 256;
            this.patterns.length = higher;

            for (i = 0; i < higher; ++i) {
              value = stream.readUint();
              while (value == 0x666c6f64) {
                stream.position += 1020;
                value = stream.readUint();
              }

              row = AmigaRow();
              row.note   = (value >> 16) & 0x0fff;
              row.sample = (value >> 24) & 0xf0 | (value >> 12) & 0x0f;
              row.effect = (value >>  8) & 0x0f;
              row.param  = value & 0xff;

              if (row.sample > 31 || !this.samples[row.sample]) row.sample = 0;

              this.patterns[i] = row;
            }

            this.mixer.store(stream, size);

            for (i = 1; i < 32; ++i) {
              sample = this.samples[i];
              if (sample == null || sample.name == "Mupp") continue;
              sample.pointer += mupp;

              if (sample.loop) {
                sample.loopPtr = sample.pointer + sample.loop;
                sample.length  = sample.loop + sample.repeat;
              } else {
                sample.loopPtr = this.mixer.memory.length;
                sample.repeat  = 2;
              }
              size = sample.pointer + 4;
              for (j = sample.pointer; j < size; ++j) this.mixer.memory[j] = 0;
            }

            sample = HMSample();
            sample.pointer = sample.loopPtr = this.mixer.memory.length;
            sample.length  = sample.repeat  = 2;
            this.samples[0] = sample;
        }},
        process: {
          value: function() {
            var chan, pattern, row, sample, value, voice = this.voices[0];

            if (!this.tick) {
              pattern = this.track[this.trackPos] + this.patternPos;

              while (voice) {
                chan = voice.channel;
                voice.enabled = 0;

                row = this.patterns[pattern + voice.index];
                voice.effect = row.effect;
                voice.param  = row.param;

                if (row.sample) {
                  sample = voice.sample = this.samples[row.sample];
                  voice.volume2 = sample.volume;

                  if (sample.name == "Mupp") {
                    sample.loopPtr = sample.pointer + sample.waves[0];
                    voice.handler = 1;
                    voice.volume1 = sample.volumes[0];
                  } else {
                    voice.handler = 0;
                    voice.volume1 = 64;
                  }
                } else {
                  sample = voice.sample;
                }

                if (row.note) {
                  if (voice.effect == 3 || voice.effect == 5) {
                    if (row.note < voice.period) {
                      voice.portaDir = 1;
                      voice.portaPeriod = row.note;
                    } else if (row.note > voice.period) {
                      voice.portaDir = 0;
                      voice.portaPeriod = row.note;
                    } else {
                      voice.portaPeriod = 0;
                    }
                  } else {
                    voice.period     = row.note;
                    voice.vibratoPos = 0;
                    voice.wavePos    = 0;
                    voice.enabled    = 1;

                    chan.enabled = 0;
                    value = (voice.period * sample.finetune) >> 8;
                    chan.period = voice.period + value;

                    if (voice.handler) {
                      chan.pointer = sample.loopPtr;
                      chan.length  = sample.repeat;
                    } else {
                      chan.pointer = sample.pointer;
                      chan.length  = sample.length;
                    }
                  }
                }

                switch (voice.effect) {
                  case 11:  //position jump
                    this.trackPos = voice.param - 1;
                    this.jumpFlag = 1;
                    break;
                  case 12:  //set volume
                    voice.volume2 = voice.param;
                    if (voice.volume2 > 64) voice.volume2 = 64;
                    break;
                  case 13:  //pattern break
                    this.jumpFlag = 1;
                    break;
                  case 14:  //set filter
                    this.mixer.filter.active = voice.param ^ 1;
                    break;
                  case 15:  //set speed
                    value = voice.param;

                    if (value < 1) value = 1;
                      else if (value > 31) value = 31;

                    this.speed = value;
                    this.tick = 0;
                    break;
                }

                if (!row.note) this.effects(voice);
                this.handler(voice);

                if (voice.enabled) chan.enabled = 1;
                chan.pointer = sample.loopPtr;
                chan.length  = sample.repeat;

                voice = voice.next;
              }
            } else {
              while (voice) {
                this.effects(voice);
                this.handler(voice);

                sample = voice.sample;
                voice.channel.pointer = sample.loopPtr;
                voice.channel.length  = sample.repeat;

                voice = voice.next;
              }
            }

            if (++this.tick == this.speed) {
              this.tick = 0;
              this.patternPos += 4;

              if (this.patternPos == 256 || this.jumpFlag) {
                this.patternPos = this.jumpFlag = 0;
                this.trackPos = (++this.trackPos & 127);

                if (this.trackPos == this.length) {
                  this.trackPos = this.restart;
                  this.mixer.complete = 1;
                }
              }
            }
        }},
        effects: {
          value: function(voice) {
            var chan = voice.channel, i, len, period = voice.period & 0x0fff, slide, value;

            if (voice.effect || voice.param) {
              switch (voice.effect) {
                case 0:   //arpeggio
                  value = this.tick % 3;
                  if (!value) break;
                  if (value == 1) value = voice.param >> 4;
                    else value = voice.param & 0x0f;

                  len = 37 - value;

                  for (i = 0; i < len; ++i) {
                    if (period >= PERIODS[i]) {
                      period = PERIODS[i + value];
                      break;
                    }
                  }
                  break;
                case 1:   //portamento up
                  voice.period -= voice.param;
                  if (voice.period < 113) voice.period = 113;
                  period = voice.period;
                  break;
                case 2:   //portamento down
                  voice.period += voice.param;
                  if (voice.period > 856) voice.period = 856;
                  period = voice.period;
                  break;
                case 3:   //tone portamento
                case 5:   //tone portamento + volume slide
                  if (voice.effect == 5) slide = 1;
                  else if (voice.param) {
                    voice.portaSpeed = voice.param;
                    voice.param = 0;
                  }

                  if (voice.portaPeriod) {
                    if (voice.portaDir) {
                      voice.period -= voice.portaSpeed;

                      if (voice.period < voice.portaPeriod) {
                        voice.period = voice.portaPeriod;
                        voice.portaPeriod = 0;
                      }
                    } else {
                      voice.period += voice.portaSpeed;

                      if (voice.period > voice.portaPeriod) {
                        voice.period = voice.portaPeriod;
                        voice.portaPeriod = 0;
                      }
                    }
                  }
                  period = voice.period;
                  break;
                case 4:   //vibrato
                case 6:   //vibrato + volume slide;
                  if (voice.effect == 6) slide = 1;
                    else if (voice.param) voice.vibratoSpeed = voice.param;

                  value = VIBRATO[(voice.vibratoPos >> 2) & 31];
                  value = ((voice.vibratoSpeed & 0x0f) * value) >> 7;

                  if (voice.vibratoPos > 127) period -= value;
                    else period += value;

                  value = (voice.vibratoSpeed >> 2) & 60;
                  voice.vibratoPos = (voice.vibratoPos + value) & 255;
                  break;
                case 7:   //mega arpeggio
                  value = MEGARPEGGIO[(voice.vibratoPos & 0x0f) + ((voice.param & 0x0f) << 4)];
                  voice.vibratoPos++;

                  for (i = 0; i < 37; ++i) if (period >= PERIODS[i]) break;

                  value += i;
                  if (value > 35) value -= 12;
                  period = PERIODS[value];
                  break;
                case 10:  //volume slide
                  slide = 1;
                  break;
              }
            }
            chan.period = period + ((period * voice.sample.finetune) >> 8);

            if (slide) {
              value = voice.param >> 4;

              if (value) voice.volume2 += value;
                else voice.volume2 -= voice.param & 0x0f;

              if (voice.volume2 > 64) voice.volume2 = 64;
                else if (voice.volume2 < 0) voice.volume2 = 0;
            }
        }},
        handler: {
          value: function(voice) {
            var sample;

            if (voice.handler) {
              sample = voice.sample;
              sample.loopPtr = sample.pointer + sample.waves[voice.wavePos];

              voice.volume1 = sample.volumes[voice.wavePos];

              if (++voice.wavePos > sample.waveLen) {
                voice.wavePos = sample.restart;
              }
            }
            voice.channel.volume = (voice.volume1 * voice.volume2) >> 6;
        }}
      });

      o.voices[0] = HMVoice(0);
      o.voices[0].next = o.voices[1] = HMVoice(1);
      o.voices[1].next = o.voices[2] = HMVoice(2);
      o.voices[2].next = o.voices[3] = HMVoice(3);

      o.track = new Uint16Array(128);
      return Object.seal(o);
    }

    var MEGARPEGGIO = [
           0, 3, 7,12,15,12, 7, 3, 0, 3, 7,12,15,12, 7, 3,
           0, 4, 7,12,16,12, 7, 4, 0, 4, 7,12,16,12, 7, 4,
           0, 3, 8,12,15,12, 8, 3, 0, 3, 8,12,15,12, 8, 3,
           0, 4, 8,12,16,12, 8, 4, 0, 4, 8,12,16,12, 8, 4,
           0, 5, 8,12,17,12, 8, 5, 0, 5, 8,12,17,12, 8, 5,
           0, 5, 9,12,17,12, 9, 5, 0, 5, 9,12,17,12, 9, 5,
          12, 0, 7, 0, 3, 0, 7, 0,12, 0, 7, 0, 3, 0, 7, 0,
          12, 0, 7, 0, 4, 0, 7, 0,12, 0, 7, 0, 4, 0, 7, 0,
           0, 3, 7, 3, 7,12, 7,12,15,12, 7,12, 7, 3, 7, 3,
           0, 4, 7, 4, 7,12, 7,12,16,12, 7,12, 7, 4, 7, 4,
          31,27,24,19,15,12, 7, 3, 0, 3, 7,12,15,19,24,27,
          31,28,24,19,16,12, 7, 4, 0, 4, 7,12,16,19,24,28,
           0,12, 0,12, 0,12, 0,12, 0,12, 0,12, 0,12, 0,12,
           0,12,24,12, 0,12,24,12, 0,12,24,12, 0,12,24,12,
           0, 3, 0, 3, 0, 3, 0, 3, 0, 3, 0, 3, 0, 3, 0, 3,
           0, 4, 0, 4, 0, 4, 0, 4, 0, 4, 0, 4, 0, 4, 0, 4],

        PERIODS = [
          856,808,762,720,678,640,604,570,538,508,480,453,
          428,404,381,360,339,320,302,285,269,254,240,226,
          214,202,190,180,170,160,151,143,135,127,120,113,0],

        VIBRATO = [
            0, 24, 49, 74, 97,120,141,161,180,197,212,224,
          235,244,250,253,255,253,250,244,235,224,212,197,
          180,161,141,120, 97, 74, 49, 24];

    window.neoart.HMPlayer = HMPlayer;
  })();
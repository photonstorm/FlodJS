/*
  Flod JS 2.1
  2012/04/30
  Christian Corti
  Neoart Costa Rica

  Last Update: Flod JS 2.0 - 2012/03/30

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
  OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
  LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR
  IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

  This work is licensed under the Creative Commons Attribution-Noncommercial-Share Alike 3.0 Unported License.
  To view a copy of this license, visit http://creativecommons.org/licenses/by-nc-sa/3.0/ or send a letter to
  Creative Commons, 171 Second Street, Suite 300, San Francisco, California, 94105, USA.
*/
  (function() {
    function D2Voice(idx) {
      return Object.create(null, {
        index          : { value:idx,  writable:true },
        next           : { value:null, writable:true },
        channel        : { value:null, writable:true },
        sample         : { value:null, writable:true },
        trackPtr       : { value:0,    writable:true },
        trackPos       : { value:0,    writable:true },
        trackLen       : { value:0,    writable:true },
        patternPos     : { value:0,    writable:true },
        restart        : { value:0,    writable:true },
        step           : { value:null, writable:true },
        row            : { value:null, writable:true },
        note           : { value:0,    writable:true },
        period         : { value:0,    writable:true },
        finalPeriod    : { value:0,    writable:true },
        arpeggioPtr    : { value:0,    writable:true },
        arpeggioPos    : { value:0,    writable:true },
        pitchBend      : { value:0,    writable:true },
        portamento     : { value:0,    writable:true },
        tableCtr       : { value:0,    writable:true },
        tablePos       : { value:0,    writable:true },
        vibratoCtr     : { value:0,    writable:true },
        vibratoDir     : { value:0,    writable:true },
        vibratoPos     : { value:0,    writable:true },
        vibratoPeriod  : { value:0,    writable:true },
        vibratoSustain : { value:0,    writable:true },
        volume         : { value:0,    writable:true },
        volumeMax      : { value:0,    writable:true },
        volumePos      : { value:0,    writable:true },
        volumeSustain  : { value:0,    writable:true },

        initialize: {
          value: function() {
            this.sample         = null;
            this.trackPtr       = 0;
            this.trackPos       = 0;
            this.trackLen       = 0;
            this.patternPos     = 0;
            this.restart        = 0;
            this.step           = null;
            this.row            = null;
            this.note           = 0;
            this.period         = 0;
            this.finalPeriod    = 0;
            this.arpeggioPtr    = 0;
            this.arpeggioPos    = 0;
            this.pitchBend      = 0;
            this.portamento     = 0;
            this.tableCtr       = 0;
            this.tablePos       = 0;
            this.vibratoCtr     = 0;
            this.vibratoDir     = 0;
            this.vibratoPos     = 0;
            this.vibratoPeriod  = 0;
            this.vibratoSustain = 0;
            this.volume         = 0;
            this.volumeMax      = 63;
            this.volumePos      = 0;
            this.volumeSustain  = 0;
        }}
      });
    }
    function D2Sample() {
      var o = AmigaSample();

      Object.defineProperties(o, {
        index     : { value:0,    writable:true },
        pitchBend : { value:0,    writable:true },
        synth     : { value:0,    writable:true },
        table     : { value:null, writable:true },
        vibratos  : { value:null, writable:true },
        volumes   : { value:null, writable:true }
      });

      o.table    = new Uint8Array(48);
      o.vibratos = new Uint8Array(15);
      o.volumes  = new Uint8Array(15);
      return Object.seal(o);
    }
    function D2Player(mixer) {
      var o = AmigaPlayer(mixer);

      Object.defineProperties(o, {
        id         : { value:"D2Player" },
        tracks     : { value:[],   writable:true },
        patterns   : { value:[],   writable:true },
        samples    : { value:[],   writable:true },
        data       : { value:null, writable:true },
        arpeggios  : { value:null, writable:true },
        voices     : { value:[],   writable:true },
        noise      : { value:0,    writable:true },

        initialize: {
          value: function() {
            var voice = this.voices[0];
            this.reset();

            this.speed = 5;
            this.tick  = 1;
            this.noise = 0;

            while (voice) {
              voice.initialize();
              voice.channel = this.mixer.channels[voice.index];
              voice.sample  = this.samples[this.samples.length - 1];

              voice.trackPtr = this.data[voice.index];
              voice.restart  = this.data[voice.index + 4];
              voice.trackLen = this.data[voice.index + 8];

              voice = voice.next;
            }
        }},
        loader: {
          value: function(stream) {
            var i = 0, id, j, len = 0, offsets, position, row, sample, step, value;
            stream.position = 3014;
            id = stream.readString(4);
            if (id != ".FNL") return;

            stream.position = 4042;
            this.data = new Uint16Array(12);

            for (; i < 4; ++i) {
              this.data[i + 4] = stream.readUshort() >> 1;
              value = stream.readUshort() >> 1;
              this.data[i + 8] = value;
              len += value;
            }

            value = len;
            for (i = 3; i > 0; --i) this.data[i] = (value -= this.data[i + 8]);
            this.tracks.length = len;

            for (i = 0; i < len; ++i) {
              step = AmigaStep();
              step.pattern   = stream.readUbyte() << 4;
              step.transpose = stream.readByte();
              this.tracks[i] = step;
            }

            len = stream.readUint() >> 2;
            this.patterns.length = len;

            for (i = 0; i < len; ++i) {
              row = AmigaRow();
              row.note   = stream.readUbyte();
              row.sample = stream.readUbyte();
              row.effect = stream.readUbyte() - 1;
              row.param  = stream.readUbyte();
              this.patterns[i] = row;
            }

            stream.position += 254;
            value = stream.readUshort();
            position = stream.position;
            stream.position -= 256;

            len = 1;
            offsets = new Uint16Array(128);

            for (i = 0; i < 128; ++i) {
              j = stream.readUshort();
              if (j != value) offsets[len++] = j;
            }

            this.samples.length = len;

            for (i = 0; i < len; ++i) {
              stream.position = position + offsets[i];
              sample = D2Sample();
              sample.length = stream.readUshort() << 1;
              sample.loop   = stream.readUshort();
              sample.repeat = stream.readUshort() << 1;

              for (j = 0; j < 15; ++j)
                sample.volumes[j] = stream.readUbyte();
              for (j = 0; j < 15; ++j)
                sample.vibratos[j] = stream.readUbyte();

              sample.pitchBend = stream.readUshort();
              sample.synth     = stream.readByte();
              sample.index     = stream.readUbyte();

              for (j = 0; j < 48; ++j)
                sample.table[j] = stream.readUbyte();

              this.samples[i] = sample;
            }

            len = stream.readUint();
            this.mixer.store(stream, len);

            stream.position += 64;
            for (i = 0; i < 8; ++i)
              offsets[i] = stream.readUint();

            len = this.samples.length;
            position = stream.position;

            for (i = 0; i < len; ++i) {
              sample = this.samples[i];
              if (sample.synth >= 0) continue;
              stream.position = position + offsets[sample.index];
              sample.pointer  = this.mixer.store(stream, sample.length);
              sample.loopPtr  = sample.pointer + sample.loop;
            }

            stream.position = 3018;
            for (i = 0; i < 1024; ++i)
              this.arpeggios[i] = stream.readByte();

            sample = D2Sample();
            sample.pointer = sample.loopPtr = this.mixer.memory.length;
            sample.length  = sample.repeat  = 2;

            this.samples[len] = sample;

            len = this.patterns.length;
            j = this.samples.length - 1;

            for (i = 0; i < len; ++i) {
              row = this.patterns[i];
              if (row.sample > j) row.sample = 0;
            }

            this.version = 2;
        }},
        process: {
          value: function() {
            var chan, i = 0, level, row, sample, value, voice = this.voices[0];

            for (; i < 64;) {
              this.noise = (this.noise << 7) | (this.noise >>> 25);
              this.noise += 0x6eca756d;
              this.noise ^= 0x9e59a92b;

              value = (this.noise >>> 24) & 255;
              if (value > 127) value |= -256;
              this.mixer.memory[i++] = value;

              value = (this.noise >>> 16) & 255;
              if (value > 127) value |= -256;
              this.mixer.memory[i++] = value;

              value = (this.noise >>> 8) & 255;
              if (value > 127) value |= -256;
              this.mixer.memory[i++] = value;

              value = this.noise & 255;
              if (value > 127) value |= -256;
              this.mixer.memory[i++] = value;
            }

            if (--this.tick < 0) this.tick = this.speed;

            while (voice) {
              if (voice.trackLen < 1) {
                voice = voice.next;
                continue;
              }

              chan = voice.channel;
              sample = voice.sample;

              if (sample.synth) {
                chan.pointer = sample.loopPtr;
                chan.length  = sample.repeat;
              }

              if (this.tick == 0) {
                if (voice.patternPos == 0) {
                  voice.step = this.tracks[voice.trackPtr + voice.trackPos];

                  if (++voice.trackPos == voice.trackLen)
                    voice.trackPos = voice.restart;
                }
                row = voice.row = this.patterns[voice.step.pattern + voice.patternPos];

                if (row.note) {
                  chan.enabled = 0;
                  voice.note = row.note;
                  voice.period = PERIODS[row.note + voice.step.transpose];

                  sample = voice.sample = this.samples[row.sample];

                  if (sample.synth < 0) {
                    chan.pointer = sample.pointer;
                    chan.length  = sample.length;
                  }

                  voice.arpeggioPos    = 0;
                  voice.tableCtr       = 0;
                  voice.tablePos       = 0;
                  voice.vibratoCtr     = sample.vibratos[1];
                  voice.vibratoPos     = 0;
                  voice.vibratoDir     = 0;
                  voice.vibratoPeriod  = 0;
                  voice.vibratoSustain = sample.vibratos[2];
                  voice.volume         = 0;
                  voice.volumePos      = 0;
                  voice.volumeSustain  = 0;
                }

                switch (row.effect) {
                  case -1:
                    break;
                  case 0:
                    this.speed = row.param & 15;
                    break;
                  case 1:
                    this.mixer.filter.active = row.param;
                    break;
                  case 2:
                    voice.pitchBend = ~(row.param & 255) + 1;
                    break;
                  case 3:
                    voice.pitchBend = row.param & 255;
                    break;
                  case 4:
                    voice.portamento = row.param;
                    break;
                  case 5:
                    voice.volumeMax = row.param & 63;
                    break;
                  case 6:
                    this.mixer.volume = row.param;
                    break;
                  case 7:
                    voice.arpeggioPtr = (row.param & 63) << 4;
                    break;
                }
                voice.patternPos = ++voice.patternPos & 15;
              }
              sample = voice.sample;

              if (sample.synth >= 0) {
                if (voice.tableCtr) {
                  voice.tableCtr--;
                } else {
                  voice.tableCtr = sample.index;
                  value = sample.table[voice.tablePos];

                  if (value == 0xff) {
                    value = sample.table[++voice.tablePos];
                    if (value != 0xff) {
                      voice.tablePos = value;
                      value = sample.table[voice.tablePos];
                    }
                  }

                  if (value != 0xff) {
                    chan.pointer = value << 8;
                    chan.length  = sample.length;
                    if (++voice.tablePos > 47) voice.tablePos = 0;
                  }
                }
              }
              value = sample.vibratos[voice.vibratoPos];

              if (voice.vibratoDir) voice.vibratoPeriod -= value;
                else voice.vibratoPeriod += value;

              if (--voice.vibratoCtr == 0) {
                voice.vibratoCtr = sample.vibratos[voice.vibratoPos + 1];
                voice.vibratoDir = ~voice.vibratoDir;
              }

              if (voice.vibratoSustain) {
                voice.vibratoSustain--;
              } else {
                voice.vibratoPos += 3;
                if (voice.vibratoPos == 15) voice.vibratoPos = 12;
                voice.vibratoSustain = sample.vibratos[voice.vibratoPos + 2];
              }

              if (voice.volumeSustain) {
                voice.volumeSustain--;
              } else {
                value = sample.volumes[voice.volumePos];
                level = sample.volumes[voice.volumePos + 1];

                if (level < voice.volume) {
                  voice.volume -= value;
                  if (voice.volume < level) {
                    voice.volume = level;
                    voice.volumePos += 3;
                    voice.volumeSustain = sample.volumes[voice.volumePos - 1];
                  }
                } else {
                  voice.volume += value;
                  if (voice.volume > level) {
                    voice.volume = level;
                    voice.volumePos += 3;
                    if (voice.volumePos == 15) voice.volumePos = 12;
                    voice.volumeSustain = sample.volumes[voice.volumePos - 1];
                  }
                }
              }

              if (voice.portamento) {
                if (voice.period < voice.finalPeriod) {
                  voice.finalPeriod -= voice.portamento;
                  if (voice.finalPeriod < voice.period) voice.finalPeriod = voice.period;
                } else {
                  voice.finalPeriod += voice.portamento;
                  if (voice.finalPeriod > voice.period) voice.finalPeriod = voice.period;
                }
              }
              value = this.arpeggios[voice.arpeggioPtr + voice.arpeggioPos];

              if (value == -128) {
                voice.arpeggioPos = 0;
                value = this.arpeggios[voice.arpeggioPtr]
              }
              voice.arpeggioPos = ++voice.arpeggioPos & 15;

              if (voice.portamento == 0) {
                value = voice.note + voice.step.transpose + value;
                if (value < 0) value = 0;
                voice.finalPeriod = PERIODS[value];
              }

              voice.vibratoPeriod -= (sample.pitchBend - voice.pitchBend);
              chan.period = voice.finalPeriod + voice.vibratoPeriod;

              value = (voice.volume >> 2) & 63;
              if (value > voice.volumeMax) value = voice.volumeMax;
              chan.volume  = value;
              chan.enabled = 1;

              voice = voice.next;
            }
        }}
      });

      o.voices[0] = D2Voice(0);
      o.voices[0].next = o.voices[1] = D2Voice(1);
      o.voices[1].next = o.voices[2] = D2Voice(2);
      o.voices[2].next = o.voices[3] = D2Voice(3);

      o.arpeggios = new Int8Array(1024);
      return Object.seal(o);
    }

    var PERIODS = [
             0,6848,6464,6096,5760,5424,5120,4832,4560,4304,4064,3840,
          3616,3424,3232,3048,2880,2712,2560,2416,2280,2152,2032,1920,
          1808,1712,1616,1524,1440,1356,1280,1208,1140,1076,1016, 960,
           904, 856, 808, 762, 720, 678, 640, 604, 570, 538, 508, 480,
           452, 428, 404, 381, 360, 339, 320, 302, 285, 269, 254, 240,
           226, 214, 202, 190, 180, 170, 160, 151, 143, 135, 127, 120,
           113, 113, 113, 113, 113, 113, 113, 113, 113, 113, 113, 113,
           113];

    window.neoart.D2Player = D2Player;
  })();
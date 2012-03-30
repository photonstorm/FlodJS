/*
  JavaScript Flod 1.0
  2012/02/08
  Christian Corti
  Neoart Costa Rica

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
  OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
  LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR
  IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

  This work is licensed under the Creative Commons Attribution-Noncommercial-Share Alike 3.0 Unported License.
  To view a copy of this license, visit http://creativecommons.org/licenses/by-nc-sa/3.0/ or send a letter to
  Creative Commons, 171 Second Street, Suite 300, San Francisco, California, 94105, USA.
*/
  (function() {
    function D1Voice(idx) {
      return Object.create(null, {
        index         : { value:idx,  writable:true },
        next          : { value:null, writable:true },
        channel        : { value:null, writable:true },
        sample        : { value:null, writable:true },
        trackPos      : { value:0,    writable:true },
        patternPos    : { value:0,    writable:true },
        status        : { value:0,    writable:true },
        speed         : { value:0,    writable:true },
        step          : { value:null, writable:true },
        row           : { value:null, writable:true },
        note          : { value:0,    writable:true },
        period        : { value:0,    writable:true },
        arpeggioPos   : { value:0,    writable:true },
        pitchBend     : { value:0,    writable:true },
        tableCtr      : { value:0,    writable:true },
        tablePos      : { value:0,    writable:true },
        vibratoCtr    : { value:0,    writable:true },
        vibratoDir    : { value:0,    writable:true },
        vibratoPos    : { value:0,    writable:true },
        vibratoPeriod : { value:0,    writable:true },
        volume        : { value:0,    writable:true },
        attackCtr     : { value:0,    writable:true },
        decayCtr      : { value:0,    writable:true },
        releaseCtr    : { value:0,    writable:true },
        sustain       : { value:0,    writable:true },

        initialize: {
          value: function() {
            this.sample        = null;
            this.trackPos      = 0;
            this.patternPos    = 0;
            this.status        = 0;
            this.speed         = 1;
            this.step          = null;
            this.row           = null;
            this.note          = 0;
            this.period        = 0;
            this.arpeggioPos   = 0;
            this.pitchBend     = 0;
            this.tableCtr      = 0;
            this.tablePos      = 0;
            this.vibratoCtr    = 0;
            this.vibratoDir    = 0;
            this.vibratoPos    = 0;
            this.vibratoPeriod = 0;
            this.volume        = 0;
            this.attackCtr     = 0;
            this.decayCtr      = 0;
            this.releaseCtr    = 0;
            this.sustain       = 1;
        }}
      });
    }
    function D1Sample() {
      var o = AmigaSample();

      Object.defineProperties(o, {
        synth        : { value:0,    writable:true },
        attackStep   : { value:0,    writable:true },
        attackDelay  : { value:0,    writable:true },
        decayStep    : { value:0,    writable:true },
        decayDelay   : { value:0,    writable:true },
        releaseStep  : { value:0,    writable:true },
        releaseDelay : { value:0,    writable:true },
        sustain      : { value:0,    writable:true },
        arpeggio     : { value:null, writable:true },
        pitchBend    : { value:0,    writable:true },
        portamento   : { value:0,    writable:true },
        table        : { value:null, writable:true },
        tableDelay   : { value:0,    writable:true },
        vibratoWait  : { value:0,    writable:true },
        vibratoStep  : { value:0,    writable:true },
        vibratoLen   : { value:0,    writable:true }
      });

      o.arpeggio = new Int8Array(8);
      o.table    = new Int8Array(48);
      return Object.seal(o);
    }
    function D1Player(mixer) {
      var o = AmigaPlayer(mixer);

      Object.defineProperties(o, {
        id         : { value:"D1Player" },
        pointers   : { value:null, writable:true },
        tracks     : { value:[],   writable:true },
        patterns   : { value:[],   writable:true },
        samples    : { value:[],   writable:true },
        voices     : { value:[],   writable:true },

        initialize: {
          value: function() {
            var voice = this.voices[0];
            this.reset();

            this.speed = 6;

            while (voice) {
              voice.initialize();
              voice.channel = this.mixer.channels[voice.index];
              voice.sample  = this.samples[20];
              voice = voice.next;
            }
        }},
        loader: {
          value: function(stream) {
            var data, i = 0, id, index, j = 0, len, position, row, sample, step, value;
            id = stream.readString(4);
            if (id != "ALL ") return;

            position = 104;
            data = new Uint32Array(25);
            for (; i < 25; ++i) data[i] = stream.readUint();

            this.pointers = new Uint32Array(4);
            for (i = 1; i < 4; ++i)
              this.pointers[i] = this.pointers[j] + (data[j++] >> 1) - 1;

            len = this.pointers[3] + (data[3] >> 1) - 1;
            this.tracks.length = len;
            index = position + data[1] - 2;
            stream.position = position;
            j = 1;

            for (i = 0; i < len; ++i) {
              step  = AmigaStep();
              value = stream.readUshort();

              if (value == 0xffff || stream.position == index) {
                step.pattern   = -1;
                step.transpose = stream.readUshort();
                index += data[j++];
              } else {
                stream.position--;
                step.pattern   = ((value >> 2) & 0x3fc0) >> 2;
                step.transpose = stream.readByte();
              }
              this.tracks[i] = step;
            }

            len = data[4] >> 2;
            this.patterns.length = len;

            for (i = 0; i < len; ++i) {
              row = AmigaRow();
              row.sample = stream.readUbyte();
              row.note   = stream.readUbyte();
              row.effect = stream.readUbyte() & 31;
              row.param  = stream.readUbyte();
              this.patterns[i] = row;
            }

            index = 5;

            for (i = 0; i < 20; ++i) {
              this.samples[i] = null;

              if (data[index] != 0) {
                sample = D1Sample();
                sample.attackStep   = stream.readUbyte();
                sample.attackDelay  = stream.readUbyte();
                sample.decayStep    = stream.readUbyte();
                sample.decayDelay   = stream.readUbyte();
                sample.sustain      = stream.readUshort();
                sample.releaseStep  = stream.readUbyte();
                sample.releaseDelay = stream.readUbyte();
                sample.volume       = stream.readUbyte();
                sample.vibratoWait  = stream.readUbyte();
                sample.vibratoStep  = stream.readUbyte();
                sample.vibratoLen   = stream.readUbyte();
                sample.pitchBend    = stream.readByte();
                sample.portamento   = stream.readUbyte();
                sample.synth        = stream.readUbyte();
                sample.tableDelay   = stream.readUbyte();

                for (j = 0; j < 8; ++j)
                  sample.arpeggio[j] = stream.readByte();

                sample.length = stream.readUshort();
                sample.loop   = stream.readUshort();
                sample.repeat = stream.readUshort() << 1;
                sample.synth  = sample.synth ? 0 : 1;

                if (sample.synth) {
                  for (j = 0; j < 48; ++j)
                    sample.table[j] = stream.readByte();

                  len = data[index] - 78;
                } else {
                  len = sample.length;
                }

                sample.pointer = this.mixer.store(stream, len);
                sample.loopPtr = sample.pointer + sample.loop;
                this.samples[i] = sample;
              }
              index++;
            }

            sample = D1Sample();
            sample.pointer = sample.loopPtr = this.mixer.memory.length;
            sample.length  = sample.repeat  = 2;
            this.samples[20] = sample;
            this.version = 1;
        }},
        process: {
          value: function() {
            var adsr, chan, loop, row, sample, value, voice = this.voices[0];

            while (voice) {
              chan = voice.channel;

              if (--voice.speed == 0) {
                voice.speed = this.speed;

                if (voice.patternPos == 0) {
                  voice.step = this.tracks[this.pointers[voice.index] + voice.trackPos];

                  if (voice.step.pattern < 0) {
                    voice.trackPos = voice.step.transpose;
                    voice.step = this.tracks[this.pointers[voice.index] + voice.trackPos];
                  }
                  voice.trackPos++;
                }

                row = this.patterns[voice.step.pattern + voice.patternPos];
                if (row.effect) voice.row = row;

                if (row.note) {
                  chan.enabled = 0;
                  voice.row = row;
                  voice.note = row.note + voice.step.transpose;
                  voice.arpeggioPos = voice.pitchBend = voice.status = 0;

                  sample = voice.sample = this.samples[row.sample];
                  if (!sample.synth) chan.pointer = sample.pointer;
                  chan.length = sample.length;

                  voice.tableCtr   = voice.tablePos = 0;
                  voice.vibratoCtr = sample.vibratoWait;
                  voice.vibratoPos = sample.vibratoLen;
                  voice.vibratoDir = sample.vibratoLen << 1;
                  voice.volume     = voice.attackCtr = voice.decayCtr = voice.releaseCtr = 0;
                  voice.sustain    = sample.sustain;
                }
                if (++voice.patternPos == 16) voice.patternPos = 0;
              }
              sample = voice.sample;

              if (sample.synth) {
                if (voice.tableCtr == 0) {
                  voice.tableCtr = sample.tableDelay;

                  do {
                    loop = 1;
                    if (voice.tablePos >= 48) voice.tablePos = 0;
                    value = sample.table[voice.tablePos];
                    voice.tablePos++;

                    if (value >= 0) {
                      chan.pointer = sample.pointer + (value << 5);
                      loop = 0;
                    } else if (value != -1) {
                      sample.tableDelay = value & 127;
                    } else {
                      voice.tablePos = sample.table[voice.tablePos];
                    }
                  } while (loop);
                } else
                  voice.tableCtr--;
              }

              if (sample.portamento) {
                value = PERIODS[voice.note] + voice.pitchBend;

                if (voice.period != 0) {
                  if (voice.period < value) {
                    voice.period += sample.portamento;
                    if (voice.period > value) voice.period = value;
                  } else {
                    voice.period -= sample.portamento;
                    if (voice.period < value) voice.period = value;
                  }
                } else
                  voice.period = value;
              }

              if (voice.vibratoCtr == 0) {
                voice.vibratoPeriod = voice.vibratoPos * sample.vibratoStep;

                if ((voice.status & 1) == 0) {
                  voice.vibratoPos++;
                  if (voice.vibratoPos == voice.vibratoDir) voice.status ^= 1;
                } else {
                  voice.vibratoPos--;
                  if (voice.vibratoPos == 0) voice.status ^= 1;
                }
              } else {
                voice.vibratoCtr--;
              }

              if (sample.pitchBend < 0) voice.pitchBend += sample.pitchBend;
                else voice.pitchBend -= sample.pitchBend;

              if (voice.row) {
                row = voice.row;

                switch (row.effect) {
                  case 0:
                    break;
                  case 1:
                    value = row.param & 15;
                    if (value) this.speed = value;
                    break;
                  case 2:
                    voice.pitchBend -= row.param;
                    break;
                  case 3:
                    voice.pitchBend += row.param;
                    break;
                  case 4:
                    this.mixer.filter.active = row.param;
                    break;
                  case 5:
                    sample.vibratoWait = row.param;
                    break;
                  case 6:
                    sample.vibratoStep = row.param;
                  case 7:
                    sample.vibratoLen = row.param;
                    break;
                  case 8:
                    sample.pitchBend = row.param;
                    break;
                  case 9:
                    sample.portamento = row.param;
                    break;
                  case 10:
                    value = row.param;
                    if (value > 64) value = 64;
                    sample.volume = 64;
                    break;
                  case 11:
                    sample.arpeggio[0] = row.param;
                    break;
                  case 12:
                    sample.arpeggio[1] = row.param;
                    break;
                  case 13:
                    sample.arpeggio[2] = row.param;
                    break;
                  case 14:
                    sample.arpeggio[3] = row.param;
                    break;
                  case 15:
                    sample.arpeggio[4] = row.param;
                    break;
                  case 16:
                    sample.arpeggio[5] = row.param;
                    break;
                  case 17:
                    sample.arpeggio[6] = row.param;
                    break;
                  case 18:
                    sample.arpeggio[7] = row.param;
                    break;
                  case 19:
                    sample.arpeggio[0] = sample.arpeggio[4] = row.param;
                    break;
                  case 20:
                    sample.arpeggio[1] = sample.arpeggio[5] = row.param;
                    break;
                  case 21:
                    sample.arpeggio[2] = sample.arpeggio[6] = row.param;
                    break;
                  case 22:
                    sample.arpeggio[3] = sample.arpeggio[7] = row.param;
                    break;
                  case 23:
                    value = row.param;
                    if (value > 64) value = 64;
                    sample.attackStep = value;
                    break;
                  case 24:
                    sample.attackDelay = row.param;
                    break;
                  case 25:
                    value = row.param;
                    if (value > 64) value = 64;
                    sample.decayStep = value;
                    break;
                  case 26:
                    sample.decayDelay = row.param;
                    break;
                  case 27:
                    sample.sustain = row.param & (sample.sustain & 255);
                    break;
                  case 28:
                    sample.sustain = (sample.sustain & 65280) + row.param;
                    break;
                  case 29:
                    value = row.param;
                    if (value > 64) value = 64;
                    sample.releaseStep = value;
                    break;
                  case 30:
                    sample.releaseDelay = row.param;
                    break;
                }
              }

              if (sample.portamento)
                value = voice.period;
              else {
                value = PERIODS[voice.note + sample.arpeggio[voice.arpeggioPos]];
                voice.arpeggioPos = ++voice.arpeggioPos & 7;
                value -= (sample.vibratoLen * sample.vibratoStep);
                value += voice.pitchBend;
                voice.period = 0;
              }

              chan.period = value + voice.vibratoPeriod;
              adsr  = voice.status & 14;
              value = voice.volume;

              if (adsr == 0) {
                if (voice.attackCtr == 0) {
                  voice.attackCtr = sample.attackDelay;
                  value += sample.attackStep;

                  if (value >= 64) {
                    adsr |= 2;
                    voice.status |= 2;
                    value = 64;
                  }
                } else {
                  voice.attackCtr--;
                }
              }

              if (adsr == 2) {
                if (voice.decayCtr == 0) {
                  voice.decayCtr = sample.decayDelay;
                  value -= sample.decayStep;

                  if (value <= sample.volume) {
                    adsr |= 6;
                    voice.status |= 6;
                    value = sample.volume;
                  }
                } else {
                  voice.decayCtr--;
                }
              }

              if (adsr == 6) {
                if (voice.sustain == 0) {
                  adsr |= 14;
                  voice.sustain |= 14;
                } else {
                  voice.sustain--;
                }
              }

              if (adsr == 14) {
                if (voice.releaseCtr == 0) {
                  voice.releaseCtr = sample.releaseDelay;
                  value -= sample.releaseStep;

                  if (value < 0) {
                    voice.status &= 9;
                    value = 0;
                  }
                } else {
                  voice.releaseCtr--;
                }
              }

              chan.volume  = voice.volume = value;
              chan.enabled = 1;

              if (!sample.synth) {
                if (sample.loop) {
                  chan.pointer = sample.loopPtr;
                  chan.length  = sample.repeat;
                } else {
                  chan.pointer = this.mixer.loopPtr;
                  chan.length  = 2;
                }
              }
              voice = voice.next;
            }
        }}
      });

      o.voices[0] = D1Voice(0);
      o.voices[0].next = o.voices[1] = D1Voice(1);
      o.voices[1].next = o.voices[2] = D1Voice(2);
      o.voices[2].next = o.voices[3] = D1Voice(3);

      return Object.seal(o);
    }

    var PERIODS = [
             0,6848,6464,6096,5760,5424,5120,4832,4560,4304,4064,3840,
          3616,3424,3232,3048,2880,2712,2560,2416,2280,2152,2032,1920,
          1808,1712,1616,1524,1440,1356,1280,1208,1140,1076, 960, 904,
           856, 808, 762, 720, 678, 640, 604, 570, 538, 508, 480, 452,
           428, 404, 381, 360, 339, 320, 302, 285, 269, 254, 240, 226,
           214, 202, 190, 180, 170, 160, 151, 143, 135, 127, 120, 113,
           113, 113, 113, 113, 113, 113, 113, 113, 113, 113, 113, 113];

    window.neoart.D1Player = D1Player;
  })();
/*
  Flod JS 2.0
  2012/04/01
  Christian Corti
  Neoart Costa Rica

  Last Update: Flod JS 2.0 - 2012/03/31

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
  OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
  LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR
  IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

  This work is licensed under the Creative Commons Attribution-Noncommercial-Share Alike 3.0 Unported License.
  To view a copy of this license, visit http://creativecommons.org/licenses/by-nc-sa/3.0/ or send a letter to
  Creative Commons, 171 Second Street, Suite 300, San Francisco, California, 94105, USA.
*/
  (function() {
    function S2Voice(idx) {
      return Object.create(null, {
        index          : { value:idx,  writable:true },
        next           : { value:null, writable:true },
        channel        : { value:null, writable:true },
        step           : { value:null, writable:true },
        row            : { value:null, writable:true },
        instr          : { value:null, writable:true },
        sample         : { value:null, writable:true },
        enabled        : { value:0,    writable:true },
        pattern        : { value:0,    writable:true },
        instrument     : { value:0,    writable:true },
        note           : { value:0,    writable:true },
        period         : { value:0,    writable:true },
        volume         : { value:0,    writable:true },
        original       : { value:0,    writable:true },
        adsrPos        : { value:0,    writable:true },
        sustainCtr     : { value:0,    writable:true },
        pitchBend      : { value:0,    writable:true },
        pitchBendCtr   : { value:0,    writable:true },
        noteSlideTo    : { value:0,    writable:true },
        noteSlideSpeed : { value:0,    writable:true },
        waveCtr        : { value:0,    writable:true },
        wavePos        : { value:0,    writable:true },
        arpeggioCtr    : { value:0,    writable:true },
        arpeggioPos    : { value:0,    writable:true },
        vibratoCtr     : { value:0,    writable:true },
        vibratoPos     : { value:0,    writable:true },
        speed          : { value:0,    writable:true },

        initialize: {
          value: function() {
            this.step           = null;
            this.row            = null;
            this.instr          = null;
            this.sample         = null;
            this.enabled        = 0;
            this.pattern        = 0;
            this.instrument     = 0;
            this.note           = 0;
            this.period         = 0;
            this.volume         = 0;
            this.original       = 0;
            this.adsrPos        = 0;
            this.sustainCtr     = 0;
            this.pitchBend      = 0;
            this.pitchBendCtr   = 0;
            this.noteSlideTo    = 0;
            this.noteSlideSpeed = 0;
            this.waveCtr        = 0;
            this.wavePos        = 0;
            this.arpeggioCtr    = 0;
            this.arpeggioPos    = 0;
            this.vibratoCtr     = 0;
            this.vibratoPos     = 0;
            this.speed          = 0;
        }}
      });
    }
    function S2Instrument() {
      return Object.create(null, {
        wave           : { value:0, writable:true },
        waveLen        : { value:0, writable:true },
        waveDelay      : { value:0, writable:true },
        waveSpeed      : { value:0, writable:true },
        arpeggio       : { value:0, writable:true },
        arpeggioLen    : { value:0, writable:true },
        arpeggioDelay  : { value:0, writable:true },
        arpeggioSpeed  : { value:0, writable:true },
        vibrato        : { value:0, writable:true },
        vibratoLen     : { value:0, writable:true },
        vibratoDelay   : { value:0, writable:true },
        vibratoSpeed   : { value:0, writable:true },
        pitchBend      : { value:0, writable:true },
        pitchBendDelay : { value:0, writable:true },
        attackMax      : { value:0, writable:true },
        attackSpeed    : { value:0, writable:true },
        decayMin       : { value:0, writable:true },
        decaySpeed     : { value:0, writable:true },
        sustain        : { value:0, writable:true },
        releaseMin     : { value:0, writable:true },
        releaseSpeed   : { value:0, writable:true }
      });
    }
    function S2Row() {
      var o = AmigaRow();

      Object.defineProperties(o, {
        speed : { value:0, writable:true }
      });

      return Object.seal(o);
    }
    function S2Sample() {
      var o = AmigaSample();

      Object.defineProperties(o, {
        negStart  : { value:0, writable:true },
        negLen    : { value:0, writable:true },
        negSpeed  : { value:0, writable:true },
        negDir    : { value:0, writable:true },
        negOffset : { value:0, writable:true },
        negPos    : { value:0, writable:true },
        negCtr    : { value:0, writable:true },
        negToggle : { value:0, writable:true }
      });

      return Object.seal(o);
    }
    function S2Step() {
      var o = AmigaStep();

      Object.defineProperties(o, {
        soundTranspose: { value:0, writable:true }
      });

      return Object.seal(o);
    }
    function S2Player(mixer) {
      var o = AmigaPlayer(mixer);

      Object.defineProperties(o, {
        id          : { value:"S2Player" },
        tracks      : { value:[],   writable:true },
        patterns    : { value:[],   writable:true },
        instruments : { value:[],   writable:true },
        samples     : { value:[],   writable:true },
        arpeggios   : { value:null, writable:true },
        vibratos    : { value:null, writable:true },
        waves       : { value:null, writable:true },
        length      : { value:0,    writable:true },
        speedDef    : { value:0,    writable:true },
        voices      : { value:[],   writable:true },
        trackPos    : { value:0,    writable:true },
        patternPos  : { value:0,    writable:true },
        patternLen  : { value:0,    writable:true },
        arpeggioFx  : { value:null, writable:true },
        arpeggioPos : { value:0,    writable:true },

        initialize: {
          value: function() {
            var voice = this.voices[0];
            this.reset();

            this.speed      = this.speedDef;
            this.tick       = this.speedDef;
            this.trackPos   = 0;
            this.patternPos = 0;
            this.patternLen = 64;

            while (voice) {
              voice.initialize();
              voice.channel = this.mixer.channels[voice.index];
              voice.instr   = this.instruments[0];

              this.arpeggioFx[voice.index] = 0;
              voice = voice.next;
            }
        }},
        loader: {
          value: function(stream) {
            var higher = 0, i = 0, id, instr, j, len, pointers, position, pos = 0, row, step, sample, sampleData, value;
            stream.position = 58;
            id = stream.readString(28);
            if (id != "SIDMON II - THE MIDI VERSION") return;

            stream.position = 2;
            this.length   = stream.readUbyte();
            this.speedDef = stream.readUbyte();
            this.samples.length = stream.readUshort() >> 6;

            stream.position = 14;
            len = stream.readUint();
            this.tracks.length = len;
            stream.position = 90;

            for (; i < len; ++i) {
              step = S2Step();
              step.pattern = stream.readUbyte();
              if (step.pattern > higher) higher = step.pattern;
              this.tracks[i] = step;
            }

            for (i = 0; i < len; ++i) {
              step = this.tracks[i];
              step.transpose = stream.readByte();
            }

            for (i = 0; i < len; ++i) {
              step = this.tracks[i];
              step.soundTranspose = stream.readByte();
            }

            position = stream.position;
            stream.position = 26;
            len = stream.readUint() >> 5;
            this.instruments.length = ++len;
            stream.position = position;

            this.instruments[0] = S2Instrument();

            for (i = 0; ++i < len;) {
              instr = S2Instrument();
              instr.wave           = stream.readUbyte() << 4;
              instr.waveLen        = stream.readUbyte();
              instr.waveSpeed      = stream.readUbyte();
              instr.waveDelay      = stream.readUbyte();
              instr.arpeggio       = stream.readUbyte() << 4;
              instr.arpeggioLen    = stream.readUbyte();
              instr.arpeggioSpeed  = stream.readUbyte();
              instr.arpeggioDelay  = stream.readUbyte();
              instr.vibrato        = stream.readUbyte() << 4;
              instr.vibratoLen     = stream.readUbyte();
              instr.vibratoSpeed   = stream.readUbyte();
              instr.vibratoDelay   = stream.readUbyte();
              instr.pitchBend      = stream.readByte();
              instr.pitchBendDelay = stream.readUbyte();
              stream.readByte();
              stream.readByte();
              instr.attackMax      = stream.readUbyte();
              instr.attackSpeed    = stream.readUbyte();
              instr.decayMin       = stream.readUbyte();
              instr.decaySpeed     = stream.readUbyte();
              instr.sustain        = stream.readUbyte();
              instr.releaseMin     = stream.readUbyte();
              instr.releaseSpeed   = stream.readUbyte();
              this.instruments[i] = instr;
              stream.position += 9;
            }

            position = stream.position;
            stream.position = 30;
            len = stream.readUint();
            this.waves = new Uint8Array(len);
            stream.position = position;

            for (i = 0; i < len; ++i) this.waves[i] = stream.readUbyte();

            position = stream.position;
            stream.position = 34;
            len = stream.readUint();
            this.arpeggios = new Int8Array(len);
            stream.position = position;

            for (i = 0; i < len; ++i) this.arpeggios[i] = stream.readByte();

            position = stream.position;
            stream.position = 38;
            len = stream.readUint();
            this.vibratos = new Int8Array(len);
            stream.position = position;

            for (i = 0; i < len; ++i) this.vibratos[i] = stream.readByte();

            len = this.samples.length;
            position = 0;

            for (i = 0; i < len; ++i) {
              sample = S2Sample();
              stream.readUint();
              sample.length    = stream.readUshort() << 1;
              sample.loop      = stream.readUshort() << 1;
              sample.repeat    = stream.readUshort() << 1;
              sample.negStart  = position + (stream.readUshort() << 1);
              sample.negLen    = stream.readUshort() << 1;
              sample.negSpeed  = stream.readUshort();
              sample.negDir    = stream.readUshort();
              sample.negOffset = stream.readShort();
              sample.negPos    = stream.readUint();
              sample.negCtr    = stream.readUshort();
              stream.position += 6;
              sample.name      = stream.readString(32);

              sample.pointer = position;
              sample.loopPtr = position + sample.loop;
              position += sample.length;
              this.samples[i] = sample;
            }

            sampleData = position;
            len = ++higher;
            pointers = new Uint16Array(++higher);
            for (i = 0; i < len; ++i) pointers[i] = stream.readUshort();

            position = stream.position;
            stream.position = 50;
            len = stream.readUint();
            this.patterns = [];
            stream.position = position;
            j = 1;

            for (i = 0; i < len; ++i) {
              row   = S2Row();
              value = stream.readByte();

              if (!value) {
                row.effect = stream.readByte();
                row.param  = stream.readUbyte();
                i += 2;
              } else if (value < 0) {
                row.speed = ~value;
              } else if (value < 112) {
                row.note = value;
                value = stream.readByte();
                i++;

                if (value < 0) {
                  row.speed = ~value;
                } else if (value < 112) {
                  row.sample = value;
                  value = stream.readByte();
                  i++;

                  if (value < 0) {
                    row.speed = ~value;
                  } else {
                    row.effect = value;
                    row.param  = stream.readUbyte();
                    i++;
                  }
                } else {
                  row.effect = value;
                  row.param  = stream.readUbyte();
                  i++;
                }
              } else {
                row.effect = value;
                row.param  = stream.readUbyte();
                i++;
              }

              this.patterns[pos++] = row;
              if ((position + pointers[j]) == stream.position) pointers[j++] = pos;
            }
            pointers[j] = this.patterns.length;

            if ((stream.position & 1) != 0) stream.position++;
            this.mixer.store(stream, sampleData);
            len = this.tracks.length;

            for (i = 0; i < len; ++i) {
              step = this.tracks[i];
              step.pattern = pointers[step.pattern];
            }

            this.length++;
            this.version = 2;
        }},
        process: {
          value: function() {
            var chan, instr, row, sample, value, voice = this.voices[0];
            this.arpeggioPos = ++this.arpeggioPos & 3;

            if (++this.tick >= this.speed) {
              this.tick = 0;

              while (voice) {
                chan = voice.channel;
                voice.enabled = voice.note = 0;

                if (!this.patternPos) {
                  voice.step    = this.tracks[this.trackPos + voice.index * this.length];
                  voice.pattern = voice.step.pattern;
                  voice.speed   = 0;
                }
                if (--voice.speed < 0) {
                  voice.row   = row = this.patterns[voice.pattern++];
                  voice.speed = row.speed;

                  if (row.note) {
                    voice.enabled = 1;
                    voice.note    = row.note + voice.step.transpose;
                    chan.enabled  = 0;
                  }
                }
                voice.pitchBend = 0;

                if (voice.note) {
                  voice.waveCtr      = voice.sustainCtr     = 0;
                  voice.arpeggioCtr  = voice.arpeggioPos    = 0;
                  voice.vibratoCtr   = voice.vibratoPos     = 0;
                  voice.pitchBendCtr = voice.noteSlideSpeed = 0;
                  voice.adsrPos = 4;
                  voice.volume  = 0;

                  if (row.sample) {
                    voice.instrument = row.sample;
                    voice.instr  = this.instruments[voice.instrument + voice.step.soundTranspose];
                    voice.sample = this.samples[this.waves[voice.instr.wave]];
                  }
                  voice.original = voice.note + this.arpeggios[voice.instr.arpeggio];
                  chan.period    = voice.period = PERIODS[voice.original];

                  sample = voice.sample;
                  chan.pointer = sample.pointer;
                  chan.length  = sample.length;
                  chan.enabled = voice.enabled;
                  chan.pointer = sample.loopPtr;
                  chan.length  = sample.repeat;
                }
                voice = voice.next;
              }

              if (++this.patternPos == this.patternLen) {
                this.patternPos = 0;

                if (++this.trackPos == this.length) {
                  this.trackPos = 0;
                  this.mixer.complete = 1;
                }
              }
            }
            voice = this.voices[0];

            while (voice) {
              if (!voice.sample) {
                voice = voice.next;
                continue;
              }
              chan   = voice.channel;
              sample = voice.sample;

              if (sample.negToggle) {
                voice = voice.next;
                continue;
              }
              sample.negToggle = 1;

              if (sample.negCtr) {
                sample.negCtr = --sample.negCtr & 31;
              } else {
                sample.negCtr = sample.negSpeed;
                if (!sample.negDir) {
                  voice = voice.next;
                  continue;
                }

                value = sample.negStart + sample.negPos;
                this.mixer.memory[value] = ~this.mixer.memory[value];
                sample.negPos += sample.negOffset;
                value = sample.negLen - 1;

                if (sample.negPos < 0) {
                  if (sample.negDir == 2) {
                    sample.negPos = value;
                  } else {
                    sample.negOffset = -sample.negOffset;
                    sample.negPos += sample.negOffset;
                  }
                } else if (value < sample.negPos) {
                  if (sample.negDir == 1) {
                    sample.negPos = 0;
                  } else {
                    sample.negOffset = -sample.negOffset;
                    sample.negPos += sample.negOffset;
                  }
                }
              }
              voice = voice.next;
            }
            voice = this.voices[0];

            while (voice) {
              if (!voice.sample) {
                voice = voice.next;
                continue;
              }
              voice.sample.negToggle = 0;
              voice = voice.next;
            }
            voice = this.voices[0];

            while (voice) {
              chan  = voice.channel;
              instr = voice.instr;

              switch (voice.adsrPos) {
                case 0:
                  break;
                case 4:   //attack
                  voice.volume += instr.attackSpeed;
                  if (instr.attackMax <= voice.volume) {
                    voice.volume = instr.attackMax;
                    voice.adsrPos--;
                  }
                  break;
                case 3:   //decay
                  if (!instr.decaySpeed) {
                    voice.adsrPos--;
                  } else {
                    voice.volume -= instr.decaySpeed;
                    if (instr.decayMin >= voice.volume) {
                      voice.volume = instr.decayMin;
                      voice.adsrPos--;
                    }
                  }
                  break;
                case 2:   //sustain
                  if (voice.sustainCtr == instr.sustain) voice.adsrPos--;
                    else voice.sustainCtr++;
                  break;
                case 1:   //release
                  voice.volume -= instr.releaseSpeed;
                  if (instr.releaseMin >= voice.volume) {
                    voice.volume = instr.releaseMin;
                    voice.adsrPos--;
                  }
                  break;
              }
              chan.volume = voice.volume >> 2;

              if (instr.waveLen) {
                if (voice.waveCtr == instr.waveDelay) {
                  voice.waveCtr = instr.waveDelay - instr.waveSpeed;
                  if (voice.wavePos == instr.waveLen) voice.wavePos = 0;
                    else voice.wavePos++;

                  voice.sample = sample = this.samples[this.waves[instr.wave + voice.wavePos]];
                  chan.pointer = sample.pointer;
                  chan.length  = sample.length;
                } else
                  voice.waveCtr++;
              }

              if (instr.arpeggioLen) {
                if (voice.arpeggioCtr == instr.arpeggioDelay) {
                  voice.arpeggioCtr = instr.arpeggioDelay - instr.arpeggioSpeed;
                  if (voice.arpeggioPos == instr.arpeggioLen) voice.arpeggioPos = 0;
                    else voice.arpeggioPos++;

                  value = voice.original + this.arpeggios[instr.arpeggio + voice.arpeggioPos];
                  voice.period = PERIODS[value];
                } else
                  voice.arpeggioCtr++;
              }
              row = voice.row;

              if (this.tick) {
                switch (row.effect) {
                  case 0:
                    break;
                  case 0x70:  //arpeggio
                    this.arpeggioFx[0] = row.param >> 4;
                    this.arpeggioFx[2] = row.param & 15;
                    value = voice.original + this.arpeggioFx[this.arpeggioPos];
                    voice.period = PERIODS[value];
                    break;
                  case 0x71:  //pitch up
                    voice.pitchBend = ~row.param + 1;
                    break;
                  case 0x72:  //pitch down
                    voice.pitchBend = row.param;
                    break;
                  case 0x73:  //volume up
                    if (voice.adsrPos != 0) break;
                    if (voice.instrument != 0) voice.volume = instr.attackMax;
                    voice.volume += row.param << 2;
                    if (voice.volume >= 256) voice.volume = -1;
                    break;
                  case 0x74:  //volume down
                    if (voice.adsrPos != 0) break;
                    if (voice.instrument != 0) voice.volume = instr.attackMax;
                    voice.volume -= row.param << 2;
                    if (voice.volume < 0) voice.volume = 0;
                    break;
                }
              }

              switch (row.effect) {
                case 0:
                  break;
                case 0x75:  //set adsr attack
                  instr.attackMax   = row.param;
                  instr.attackSpeed = row.param;
                  break;
                case 0x76:  //set pattern length
                  this.patternLen = row.param;
                  break;
                case 0x7c:  //set volume
                  chan.volume  = row.param;
                  voice.volume = row.param << 2;
                  if (voice.volume >= 255) voice.volume = 255;
                  break;
                case 0x7f:  //set speed
                  value = row.param & 15;
                  if (value) this.speed = value;
                  break;
              }

              if (instr.vibratoLen) {
                if (voice.vibratoCtr == instr.vibratoDelay) {
                  voice.vibratoCtr = instr.vibratoDelay - instr.vibratoSpeed;
                  if (voice.vibratoPos == instr.vibratoLen) voice.vibratoPos = 0;
                    else voice.vibratoPos++;

                  voice.period += this.vibratos[instr.vibrato + voice.vibratoPos];
                } else
                  voice.vibratoCtr++;
              }

              if (instr.pitchBend) {
                if (voice.pitchBendCtr == instr.pitchBendDelay) {
                  voice.pitchBend += instr.pitchBend;
                } else
                  voice.pitchBendCtr++;
              }

              if (row.param) {
                if (row.effect && row.effect < 0x70) {
                  voice.noteSlideTo = PERIODS[row.effect + voice.step.transpose];
                  value = row.param;
                  if ((voice.noteSlideTo - voice.period) < 0) value = -value;
                  voice.noteSlideSpeed = value;
                }
              }

              if (voice.noteSlideTo && voice.noteSlideSpeed) {
                voice.period += voice.noteSlideSpeed;

                if ((voice.noteSlideSpeed < 0 && voice.period < voice.noteSlideTo) ||
                    (voice.noteSlideSpeed > 0 && voice.period > voice.noteSlideTo)) {
                  voice.noteSlideSpeed = 0;
                  voice.period = voice.noteSlideTo;
                }
              }

              voice.period += voice.pitchBend;
              if (voice.period < 95) voice.period = 95;
                else if (voice.period > 5760) voice.period = 5760;

              chan.period = voice.period;
              voice = voice.next;
            }
        }}
      });

      o.voices[0] = S2Voice(0);
      o.voices[0].next = o.voices[1] = S2Voice(1);
      o.voices[1].next = o.voices[2] = S2Voice(2);
      o.voices[2].next = o.voices[3] = S2Voice(3);

      o.arpeggioFx = new Uint8Array(4);
      return Object.seal(o);
    }

    var PERIODS = [0,
          5760,5424,5120,4832,4560,4304,4064,3840,3616,3424,3232,3048,
          2880,2712,2560,2416,2280,2152,2032,1920,1808,1712,1616,1524,
          1440,1356,1280,1208,1140,1076,1016, 960, 904, 856, 808, 762,
           720, 678, 640, 604, 570, 538, 508, 480, 453, 428, 404, 381,
           360, 339, 320, 302, 285, 269, 254, 240, 226, 214, 202, 190,
           180, 170, 160, 151, 143, 135, 127, 120, 113, 107, 101,  95];

    window.neoart.S2Player = S2Player;
  })();
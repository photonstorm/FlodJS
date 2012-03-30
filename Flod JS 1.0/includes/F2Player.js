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
    function F2Voice(idx) {
      var o = Object.create(null, {
        index          : { value:idx,  writable:true },
        next           : { value:null, writable:true },
        flags          : { value:0,    writable:true },
        delay          : { value:0,    writable:true },
        channel        : { value:null, writable:true },
        patternLoop    : { value:0,    writable:true },
        patternLoopRow : { value:0,    writable:true },
        playing        : { value:null, writable:true },
        note           : { value:0,    writable:true },
        keyoff         : { value:0,    writable:true },
        period         : { value:0,    writable:true },
        finetune       : { value:0,    writable:true },
        arpDelta       : { value:0,    writable:true },
        vibDelta       : { value:0,    writable:true },
        instrument     : { value:null, writable:true },
        autoVibratoPos : { value:0,    writable:true },
        autoSweep      : { value:0,    writable:true },
        autoSweepPos   : { value:0,    writable:true },
        sample         : { value:null, writable:true },
        sampleOffset   : { value:0,    writable:true },
        volume         : { value:0,    writable:true },
        volEnabled     : { value:0,    writable:true },
        volEnvelope    : { value:null, writable:true },
        volDelta       : { value:0,    writable:true },
        volSlide       : { value:0,    writable:true },
        volSlideMaster : { value:0,    writable:true },
        fineSlideU     : { value:0,    writable:true },
        fineSlideD     : { value:0,    writable:true },
        fadeEnabled    : { value:0,    writable:true },
        fadeDelta      : { value:0,    writable:true },
        fadeVolume     : { value:0,    writable:true },
        panning        : { value:0,    writable:true },
        panEnabled     : { value:0,    writable:true },
        panEnvelope    : { value:null, writable:true },
        panSlide       : { value:0,    writable:true },
        portaU         : { value:0,    writable:true },
        portaD         : { value:0,    writable:true },
        finePortaU     : { value:0,    writable:true },
        finePortaD     : { value:0,    writable:true },
        xtraPortaU     : { value:0,    writable:true },
        xtraPortaD     : { value:0,    writable:true },
        portaPeriod    : { value:0,    writable:true },
        portaSpeed     : { value:0,    writable:true },
        glissando      : { value:0,    writable:true },
        glissPeriod    : { value:0,    writable:true },
        vibratoPos     : { value:0,    writable:true },
        vibratoSpeed   : { value:0,    writable:true },
        vibratoDepth   : { value:0,    writable:true },
        vibratoReset   : { value:0,    writable:true },
        tremoloPos     : { value:0,    writable:true },
        tremoloSpeed   : { value:0,    writable:true },
        tremoloDepth   : { value:0,    writable:true },
        waveControl    : { value:0,    writable:true },
        tremorPos      : { value:0,    writable:true },
        tremorOn       : { value:0,    writable:true },
        tremorOff      : { value:0,    writable:true },
        tremorVolume   : { value:0,    writable:true },
        retrigx        : { value:0,    writable:true },
        retrigy        : { value:0,    writable:true },

        reset: {
          value: function() {
            this.volume   = this.sample.volume;
            this.panning  = this.sample.panning;
            this.finetune = (this.sample.finetune >> 3) << 2;
            this.keyoff   = 0;
            this.volDelta = 0;

            this.fadeEnabled = 0;
            this.fadeDelta   = 0;
            this.fadeVolume  = 65536;

            this.autoVibratoPos = 0;
            this.autoSweep      = 1;
            this.autoSweepPos   = 0;
            this.vibDelta       = 0;
            this.vibratoReset   = 0;

            if ((this.waveControl & 15) < 4) this.vibratoPos = 0;
            if ((this.waveControl >> 4) < 4) this.tremoloPos = 0;
          }},
        autoVibrato: {
          value: function() {
            var delta;
            this.autoVibratoPos = (this.autoVibratoPos + this.playing.vibratoSpeed) & 255;

            switch (this.playing.vibratoType) {
              case 0:
                delta = AUTOVIBRATO[this.autoVibratoPos];
                break;
              case 1:
                if (this.autoVibratoPos < 128) delta = -64; else delta = 64;
                break;
              case 2:
                delta = ((64 + (this.autoVibratoPos >> 1)) & 127) - 64;
                break;
              case 3:
                delta = ((64 - (this.autoVibratoPos >> 1)) & 127) - 64;
                break;
            }

            delta *= this.playing.vibratoDepth;

            if (this.autoSweep) {
              if (!this.playing.vibratoSweep) {
                this.autoSweep = 0;
              } else {
                if (this.autoSweepPos > this.playing.vibratoSweep) {
                  if (this.autoSweepPos & 2) delta *= (this.autoSweepPos / this.playing.vibratoSweep);
                  this.autoSweep = 0;
                } else {
                  delta *= (++this.autoSweepPos / this.playing.vibratoSweep);
                }
              }
            }

            this.flags |= UPDATE_PERIOD;
            return (delta >> 6);
          }},
        tonePortamento: {
          value: function() {
            if (!this.glissPeriod) this.glissPeriod = this.period;

            if (this.period < this.portaPeriod) {
              this.glissPeriod += this.portaSpeed << 2;

              if (!this.glissando) this.period = this.glissPeriod;
                else this.period = Math.round(this.glissPeriod / 64) << 6;

              if (this.period >= this.portaPeriod) {
                this.period = this.portaPeriod;
                this.glissPeriod = this.portaPeriod = 0;
              }
            } else if (this.period > this.portaPeriod) {
              this.glissPeriod -= this.portaSpeed << 2;

              if (!this.glissando) this.period = this.glissPeriod;
                else this.period = Math.round(this.glissPeriod / 64) << 6;

              if (this.period <= this.portaPeriod) {
                this.period = this.portaPeriod;
                this.glissPeriod = this.portaPeriod = 0;
              }
            }

            this.flags |= UPDATE_PERIOD;
          }},
        tremolo: {
          value: function() {
            var delta = 255, position = this.tremoloPos & 31;

            switch ((this.waveControl >> 4) & 3) {
              case 0:
                delta = VIBRATO[position];
                break;
              case 1:
                delta = position << 3;
                break;
            }

            this.volDelta = (delta * this.tremoloDepth) >> 6;
            if (this.tremoloPos > 31) this.volDelta = -this.volDelta;
            this.tremoloPos = (this.tremoloPos + this.tremoloSpeed) & 63;

            this.flags |= UPDATE_VOLUME;
          }},
        tremor: {
          value: function() {
            if (this.tremorPos == this.tremorOn) {
              this.tremorVolume = this.volume;
              this.volume = 0;
              this.flags |= UPDATE_VOLUME;
            } else {
              this.tremorPos = 0;
              this.volume = this.tremorVolume;
              this.flags |= UPDATE_VOLUME;
            }

            this.tremorPos++;
          }},
        vibrato: {
          value: function() {
            var delta = 255, position = this.vibratoPos & 31;

            switch (this.waveControl & 3) {
              case 0:
                delta = VIBRATO[position];
                break;
              case 1:
                delta = position << 3;
                if (this.vibratoPos > 31) delta = 255 - delta;
                break;
            }

            this.vibDelta = (delta * this.vibratoDepth) >> 7;
            if (this.vibratoPos > 31) this.vibDelta = -this.vibDelta;
            this.vibratoPos = (this.vibratoPos + this.vibratoSpeed) & 63;

            this.flags |= UPDATE_PERIOD;
          }}
      });

      o.volEnvelope = F2Envelope();
      o.panEnvelope = F2Envelope();
      return Object.seal(o);
    }
    function F2Data() {
      return Object.create(null, {
        points    : { value:[], writable:true },
        total     : { value:0,  writable:true },
        sustain   : { value:0,  writable:true },
        loopStart : { value:0,  writable:true },
        loopEnd   : { value:0,  writable:true },
        flags     : { value:0,  writable:true }
      });
    }
    function F2Envelope() {
      return Object.create(null, {
        value    : { value:0, writable:true },
        position : { value:0, writable:true },
        frame    : { value:0, writable:true },
        delta    : { value:0, writable:true },
        fraction : { value:0, writable:true },
        stopped  : { value:0, writable:true },

        reset: {
          value: function() {
            this.value    = 0;
            this.position = 0;
            this.frame    = 0;
            this.delta    = 0;
            this.fraction = 0;
            this.stopped  = 0;
          }}
      });
    }
    function F2Instrument() {
      var o = Object.create(null, {
        name         : { value:"",   writable:true },
        samples      : { value:[],   writable:true },
        noteSamples  : { value:null, writable:true },
        fadeout      : { value:0,    writable:true },
        volData      : { value:null, writable:true },
        volEnabled   : { value:0,    writable:true },
        panData      : { value:null, writable:true },
        panEnabled   : { value:0,    writable:true },
        vibratoType  : { value:0,    writable:true },
        vibratoSweep : { value:0,    writable:true },
        vibratoSpeed : { value:0,    writable:true },
        vibratoDepth : { value:0,    writable:true }
      });

      o.noteSamples = new Uint8Array(96);
      o.volData = F2Data();
      o.panData = F2Data();
      return Object.seal(o);
    }
    function F2Pattern(length, channels) {
      var o = Object.create(null, {
        rows   : { value:[], writable:true },
        length : { value:0,  writable:true },
        size   : { value:0,  writable:true }
      });

      o.rows.length = o.size = length * channels;
      o.length = length;
      return Object.seal(o);
    }
    function F2Point(x, y) {
      var o = Object.create(null, {
        frame : { value:0, writable:true },
        value : { value:0, writable:true }
      });

      o.frame = x || 0;
      o.value = y || 0;
      return Object.seal(o);
    }
    function F2Row() {
      return Object.create(null, {
        note       : { value:0, writable:true },
        instrument : { value:0, writable:true },
        volume     : { value:0, writable:true },
        effect     : { value:0, writable:true },
        param      : { value:0, writable:true }
      });
    }
    function F2Sample() {
      var o = SBSample();

      Object.defineProperties(o, {
        finetune:  { value:0,  writable:true },
        panning:   { value:0,  writable:true },
        relative:  { value:0,  writable:true }
      });

      return Object.seal(o);
    }
    function F2Player(mixer) {
      var o = SBPlayer(mixer);

      Object.defineProperties(o, {
        id            : { value:"F2Player" },
        patterns      : { value:[],   writable:true },
        instruments   : { value:[],   writable:true },
        voices        : { value:[],   writable:true },
        linear        : { value:0,    writable:true },
        complete      : { value:0,    writable:true },
        order         : { value:0,    writable:true },
        position      : { value:0,    writable:true },
        nextOrder     : { value:0,    writable:true },
        nextPosition  : { value:0,    writable:true },
        pattern       : { value:null, writable:true },
        patternDelay  : { value:0,    writable:true },
        patternOffset : { value:0,    writable:true },
        timer         : { value:0,    writable:true },

        initialize: {
          value: function() {
            var i = 0, voice;
            this.reset();

            this.timer         = this.speed;
            this.order         =  0;
            this.position      =  0;
            this.nextOrder     = -1;
            this.nextPosition  = -1;
            this.patternDelay  =  0;
            this.patternOffset =  0;
            this.complete      =  0;
            this.master        = 64;

            this.voices.length = this.channels;

            for (; i < this.channels; ++i) {
              voice = F2Voice(i);

              voice.channel = this.mixer.channels[i];
              voice.playing = this.instruments[0];
              voice.sample  = voice.playing.samples[0];

              this.voices[i] = voice;
              if (i) this.voices[i - 1].next = voice;
            }
        }},
        loader: {
          value: function(stream) {
            var header, i, id, iheader, instr, ipos, j, len, pattern, pos, reserved = 22, row, rows, sample, value;
            if (stream.length < 360) return;
            stream.position = 17;

            this.title = stream.readString(20);
            stream.position++;
            id = stream.readString(20);

            if (id == "FastTracker v2.00   ") {
              this.version = 1;
            } else if (id == "Sk@le Tracker") {
              reserved = 2;
              this.version = 2;
            } else if (id == "MadTracker 2.0") {
              this.version = 3;
            } else if (id == "MilkyTracker        ") {
              this.version = 4;
            } else if (id.indexOf("OpenMPT") != -1) {
              this.version = 5;
            } else return;

            stream.readUshort();

            header = stream.readUint();
            this.length   = stream.readUshort();
            this.restart  = stream.readUshort();
            this.channels = stream.readUshort();

            value = rows = stream.readUshort();
            this.instruments = [];
            this.instruments.length = stream.readUshort() + 1;

            this.linear = stream.readUshort();
            this.speed  = stream.readUshort();
            this.tempo  = stream.readUshort();

            this.track = new Uint8Array(this.length);

            for (i = 0; i < this.length; ++i) {
              j = stream.readUbyte();
              if (j >= value) rows = j + 1;
              this.track[i] = j;
            }

            this.patterns = [];
            this.patterns.length = rows;

            if (rows != value) {
              pattern = F2Pattern(64, this.channels);
              j = pattern.size;
              for (i = 0; i < j; ++i) pattern.rows[i] = F2Row();
              this.patterns[--rows] = pattern;
            }

            stream.position = pos = header + 60;
            len = value;

            for (i = 0; i < len; ++i) {
              header = stream.readUint();
              stream.position++;

              pattern = F2Pattern(stream.readUshort(), this.channels);
              rows = pattern.size;

              value = stream.readUshort();
              stream.position = pos + header;
              ipos = stream.position + value;

              if (value) {
                for (j = 0; j < rows; ++j) {
                  row = F2Row();
                  value = stream.readUbyte();

                  if (value & 128) {
                    if (value &  1) row.note       = stream.readUbyte();
                    if (value &  2) row.instrument = stream.readUbyte();
                    if (value &  4) row.volume     = stream.readUbyte();
                    if (value &  8) row.effect     = stream.readUbyte();
                    if (value & 16) row.param      = stream.readUbyte();
                  } else {
                    row.note       = value;
                    row.instrument = stream.readUbyte();
                    row.volume     = stream.readUbyte();
                    row.effect     = stream.readUbyte();
                    row.param      = stream.readUbyte();
                  }

                  if (row.note != KEYOFF_NOTE) if (row.note > 96) row.note = 0;
                  pattern.rows[j] = row;
                }
              } else {
                for (j = 0; j < rows; ++j) pattern.rows[j] = F2Row();
              }

              this.patterns[i] = pattern;
              pos = stream.position;
              if (pos != ipos) pos = stream.position = ipos;
            }

            ipos = stream.position;
            len = this.instruments.length;

            for (i = 1; i < len; ++i) {
              iheader = stream.readUint();
              if ((stream.position + iheader) >= stream.length) break;

              instr = F2Instrument();
              instr.name = stream.readString(22);
              stream.position++;

              value = stream.readUshort();
              if (value > 16) value = 16;
              header = stream.readUint();
              if (reserved == 2 && header != 64) header = 64;

              if (value) {
                instr.samples = [];
                instr.samples.length = value;

                for (j = 0; j < 96; ++j)
                  instr.noteSamples[j] = stream.readUbyte();
                for (j = 0; j < 12; ++j)
                  instr.volData.points[j] = F2Point(stream.readUshort(), stream.readUshort());
                for (j = 0; j < 12; ++j)
                  instr.panData.points[j] = F2Point(stream.readUshort(), stream.readUshort());

                instr.volData.total     = stream.readUbyte();
                instr.panData.total     = stream.readUbyte();
                instr.volData.sustain   = stream.readUbyte();
                instr.volData.loopStart = stream.readUbyte();
                instr.volData.loopEnd   = stream.readUbyte();
                instr.panData.sustain   = stream.readUbyte();
                instr.panData.loopStart = stream.readUbyte();
                instr.panData.loopEnd   = stream.readUbyte();
                instr.volData.flags     = stream.readUbyte();
                instr.panData.flags     = stream.readUbyte();

                if (instr.volData.flags & ENVELOPE_ON) instr.volEnabled = 1;
                if (instr.panData.flags & ENVELOPE_ON) instr.panEnabled = 1;

                instr.vibratoType  = stream.readUbyte();
                instr.vibratoSweep = stream.readUbyte();
                instr.vibratoDepth = stream.readUbyte();
                instr.vibratoSpeed = stream.readUbyte();
                instr.fadeout      = stream.readUshort() << 1;

                stream.position += reserved;
                pos = stream.position;
                this.instruments[i] = instr;

                for (j = 0; j < value; ++j) {
                  sample = F2Sample();
                  sample.length    = stream.readUint();
                  sample.loopStart = stream.readUint();
                  sample.loopLen   = stream.readUint();
                  sample.volume    = stream.readUbyte();
                  sample.finetune  = stream.readByte();
                  sample.loopMode  = stream.readUbyte();
                  sample.panning   = stream.readUbyte();
                  sample.relative  = stream.readByte();

                  stream.position++;
                  sample.name = stream.readString(22);
                  instr.samples[j] = sample;

                  stream.position = (pos += header);
                }

                for (j = 0; j < value; ++j) {
                  sample = instr.samples[j];
                  if (!sample.length) continue;
                  pos = stream.position + sample.length;

                  if (sample.loopMode & 16) {
                    sample.bits       = 16;
                    sample.loopMode  ^= 16;
                    sample.length    >>= 1;
                    sample.loopStart >>= 1;
                    sample.loopLen   >>= 1;
                  }

                  if (!sample.loopLen) sample.loopMode = 0;
                  sample.store(stream);
                  if (sample.loopMode) sample.length = sample.loopStart + sample.loopLen;
                  stream.position = pos;
                }
              } else {
                stream.position = ipos + iheader;
              }

              ipos = stream.position;
              if (ipos >= stream.length) break;
            }

            instr = F2Instrument();
            instr.volData = F2Data();
            instr.panData = F2Data();
            instr.samples = [];

            for (i = 0; i < 12; ++i) {
              instr.volData.points[i] = F2Point();
              instr.panData.points[i] = F2Point();
            }

            sample = F2Sample();
            sample.length = 220;
            sample.data = new Float32Array(220);

            for (i = 0; i < 220; ++i) sample.data[i] = 0.0;

            instr.samples[0] = sample;
            this.instruments[0] = instr;
        }},
        process: {
          value: function() {
            var com, curr, instr, i, jumpFlag, next, paramx, paramy, porta, row, sample, slide, value, voice = this.voices[0];

            if (!this.tick) {
              if (this.nextOrder >= 0) this.order = this.nextOrder;
              if (this.nextPosition >= 0) this.position = this.nextPosition;

              this.nextOrder = this.nextPosition = -1;
              this.pattern = this.patterns[this.track[this.order]];

              while (voice) {
                row = this.pattern.rows[this.position + voice.index];
                com = row.volume >> 4;
                porta = (row.effect == 3 || row.effect == 5 || com == 15);
                paramx = row.param >> 4;
                voice.keyoff = 0;

                if (voice.arpDelta) {
                  voice.arpDelta = 0;
                  voice.flags |= UPDATE_PERIOD;
                }

                if (row.instrument) {
                  voice.instrument = (row.instrument < this.instruments.length) ? this.instruments[row.instrument] : null;
                  voice.volEnvelope.reset();
                  voice.panEnvelope.reset();
                  voice.flags |= (UPDATE_VOLUME | UPDATE_PANNING | SHORT_RAMP);
                } else if (row.note == KEYOFF_NOTE || (row.effect == 20 && !row.param)) {
                  voice.fadeEnabled = 1;
                  voice.keyoff = 1;
                }

                if (row.note && row.note != KEYOFF_NOTE) {
                  if (voice.instrument) {
                    instr  = voice.instrument;
                    value  = row.note - 1;
                    sample = instr.samples[instr.noteSamples[value]];
                    value += sample.relative;

                    if (value >= LOWER_NOTE && value <= HIGHER_NOTE) {
                      if (!porta) {
                        voice.note = value;
                        voice.sample = sample;

                        if (row.instrument) {
                          voice.volEnabled = instr.volEnabled;
                          voice.panEnabled = instr.panEnabled;
                          voice.flags |= UPDATE_ALL;
                        } else {
                          voice.flags |= (UPDATE_PERIOD | UPDATE_TRIGGER);
                        }
                      }

                      if (row.instrument) {
                        voice.reset();
                        voice.fadeDelta = instr.fadeout;
                      } else {
                        voice.finetune = (sample.finetune >> 3) << 2;
                      }

                      if (row.effect == 14 && paramx == 5)
                        voice.finetune = ((row.param & 15) - 8) << 3;

                      if (this.linear) {
                        value = ((120 - value) << 6) - voice.finetune;
                      } else {
                        value = this.amiga(value, voice.finetune);
                      }

                      if (!porta) {
                        voice.period = value;
                        voice.glissPeriod = 0;
                      } else {
                        voice.portaPeriod = value;
                      }
                    }
                  } else {
                    voice.volume = 0;
                    voice.flags = (UPDATE_VOLUME | SHORT_RAMP);
                  }
                } else if (voice.vibratoReset) {
                  if (row.effect != 4 && row.effect != 6) {
                    voice.vibDelta = 0;
                    voice.vibratoReset = 0;
                    voice.flags |= UPDATE_PERIOD;
                  }
                }

                if (row.volume) {
                  if (row.volume >= 16 && row.volume <= 80) {
                    voice.volume = row.volume - 16;
                    voice.flags |= (UPDATE_VOLUME | SHORT_RAMP);
                  } else {
                    paramy = row.volume & 15;

                    switch (com) {
                      case 6:   //vx fine volume slide down
                        voice.volume -= paramy;
                        if (voice.volume < 0) voice.volume = 0;
                        voice.flags |= UPDATE_VOLUME;
                        break;
                      case 7:   //vx fine volume slide up
                        voice.volume += paramy;
                        if (voice.volume > 64) voice.volume = 64;
                        voice.flags |= UPDATE_VOLUME;
                        break;
                      case 10:  //vx set vibrato speed
                        if (paramy) voice.vibratoSpeed = paramy;
                        break;
                      case 11:  //vx vibrato
                        if (paramy) voice.vibratoDepth = paramy << 2;
                        break;
                      case 12:  //vx set panning
                        voice.panning = paramy << 4;
                        voice.flags |= UPDATE_PANNING;
                        break;
                      case 15:  //vx tone portamento
                        if (paramy) voice.portaSpeed = paramy << 4;
                        break;
                    }
                  }
                }

                if (row.effect) {
                  paramy = row.param & 15;

                  switch (row.effect) {
                    case 1:   //fx portamento up
                      if (row.param) voice.portaU = row.param << 2;
                      break;
                    case 2:   //fx portamento down
                      if (row.param) voice.portaD = row.param << 2;
                      break;
                    case 3:   //fx tone portamento
                      if (row.param && com != 15) voice.portaSpeed = row.param;
                      break;
                    case 4:   //fx vibrato
                      voice.vibratoReset = 1;
                      break;
                    case 5:   //fx tone portamento + volume slide
                      if (row.param) voice.volSlide = row.param;
                      break;
                    case 6:   //fx vibrato + volume slide
                      if (row.param) voice.volSlide = row.param;
                      voice.vibratoReset = 1;
                      break;
                    case 7:   //fx tremolo
                      if (paramx) voice.tremoloSpeed = paramx;
                      if (paramy) voice.tremoloDepth = paramy;
                      break;
                    case 8:   //fx set panning
                      voice.panning = row.param;
                      voice.flags |= UPDATE_PANNING;
                      break;
                    case 9:   //fx sample offset
                      if (row.param) voice.sampleOffset = row.param << 8;

                      if (voice.sampleOffset >= voice.sample.length) {
                        voice.volume = 0;
                        voice.sampleOffset = 0;
                        voice.flags &= ~(UPDATE_PERIOD | UPDATE_TRIGGER);
                        voice.flags |=  (UPDATE_VOLUME | SHORT_RAMP);
                      }
                      break;
                    case 10:  //fx volume slide
                      if (row.param) voice.volSlide = row.param;
                      break;
                    case 11:  //fx position jump
                      this.nextOrder = row.param;

                      if (this.nextOrder >= this.length) this.complete = 1;
                        else this.nextPosition = 0;

                      jumpFlag = 1;
                      this.patternOffset = 0;
                      break;
                    case 12:  //fx set volume
                      voice.volume = row.param;
                      voice.flags |= (UPDATE_VOLUME | SHORT_RAMP);
                      break;
                    case 13:  //fx pattern break
                      this.nextPosition = ((paramx * 10) + paramy) * this.channels;
                      this.patternOffset = 0;

                      if (!jumpFlag) {
                        this.nextOrder = this.order + 1;

                        if (this.nextOrder >= this.length) {
                          this.complete = 1;
                          this.nextPosition = -1;
                        }
                      }
                      break;
                    case 14:  //fx extended effects

                      switch (paramx) {
                        case 1:   //ex fine portamento up
                          if (paramy) voice.finePortaU = paramy << 2;
                          voice.period -= voice.finePortaU;
                          voice.flags |= UPDATE_PERIOD;
                          break;
                        case 2:   //ex fine portamento down
                          if (paramy) voice.finePortaD = paramy << 2;
                          voice.period += voice.finePortaD;
                          voice.flags |= UPDATE_PERIOD;
                          break;
                        case 3:   //ex glissando control
                          voice.glissando = paramy;
                          break;
                        case 4:   //ex vibrato control
                          voice.waveControl = (voice.waveControl & 0xf0) | paramy;
                          break;
                        case 6:   //ex pattern loop
                          if (!paramy) {
                            voice.patternLoopRow = this.patternOffset = this.position;
                          } else {
                            if (!voice.patternLoop) {
                              voice.patternLoop = paramy;
                            } else {
                              voice.patternLoop--;
                            }

                            if (voice.patternLoop)
                              this.nextPosition = voice.patternLoopRow;
                          }
                          break;
                        case 7:   //ex tremolo control
                          voice.waveControl = (voice.waveControl & 0x0f) | (paramy << 4);
                          break;
                        case 10:  //ex fine volume slide up
                          if (paramy) voice.fineSlideU = paramy;
                          voice.volume += voice.fineSlideU;
                          voice.flags |= UPDATE_VOLUME;
                          break;
                        case 11:  //ex fine volume slide down
                          if (paramy) voice.fineSlideD = paramy;
                          voice.volume -= voice.fineSlideD;
                          voice.flags |= UPDATE_VOLUME;
                          break;
                        case 13:  //ex note delay
                          voice.delay = voice.flags;
                          voice.flags = 0;
                          break;
                        case 14:  //ex pattern delay
                          this.patternDelay = paramy * this.timer;
                          break;
                      }

                      break;
                    case 15:  //fx set speed
                      if (!row.param) break;
                      if (row.param < 32) this.timer = row.param;
                        else this.mixer.samplesTick = ((this.sampleRate * 2.5) / row.param) >> 0;
                      break;
                    case 16:  //fx set global volume
                      this.master = row.param;
                      if (this.master > 64) this.master = 64;
                      voice.flags |= UPDATE_VOLUME;
                      break;
                    case 17:  //fx global volume slide
                      if (row.param) voice.volSlideMaster = row.param;
                      break;
                    case 21:  //fx set envelope position
                      if (!voice.instrument || !voice.instrument.volEnabled) break;
                      instr  = voice.instrument;
                      value  = row.param;
                      paramx = instr.volData.total;

                      for (i = 0; i < paramx; i++)
                        if (value < instr.volData.points[i].frame) break;

                      voice.volEnvelope.position = --i;
                      paramx--;

                      if ((instr.volData.flags & ENVELOPE_LOOP) && i == instr.volData.loopEnd) {
                        i = voice.volEnvelope.position = instr.volData.loopStart;
                        value = instr.volData.points[i].frame;
                        voice.volEnvelope.frame = value;
                      }

                      if (i >= paramx) {
                        voice.volEnvelope.value = instr.volData.points[paramx].value;
                        voice.volEnvelope.stopped = 1;
                      } else {
                        voice.volEnvelope.stopped = 0;
                        voice.volEnvelope.frame = value;
                        if (value > instr.volData.points[i].frame) voice.volEnvelope.position++;

                        curr  = instr.volData.points[i];
                        next  = instr.volData.points[++i];
                        value = next.frame - curr.frame;

                        voice.volEnvelope.delta = (value ? (((next.value - curr.value) << 8) / value) >> 0 : 0) || 0;
                        voice.volEnvelope.fraction = (curr.value << 8);
                      }
                      break;
                    case 24:  //fx panning slide
                      if (row.param) voice.panSlide = row.param;
                      break;
                    case 27:  //fx multi retrig note
                      if (paramx) voice.retrigx = paramx;
                      if (paramy) voice.retrigy = paramy;

                      if (!row.volume && voice.retrigy) {
                        com = this.tick + 1;
                        if (com % voice.retrigy) break;
                        if (row.volume > 80 && voice.retrigx) this.retrig(voice);
                      }
                      break;
                    case 29:  //fx tremor
                      if (row.param) {
                        voice.tremorOn  = ++paramx;
                        voice.tremorOff = ++paramy + paramx;
                      }
                      break;
                    case 33:  //fx extra fine portamento
                      if (paramx == 1) {
                        if (paramy) voice.xtraPortaU = paramy;
                        voice.period -= voice.xtraPortaU;
                        voice.flags |= UPDATE_PERIOD;
                      } else if (paramx == 2) {
                        if (paramy) voice.xtraPortaD = paramy;
                        voice.period += voice.xtraPortaD;
                        voice.flags |= UPDATE_PERIOD;
                      }
                      break;
                  }
                }
                voice = voice.next;
              }
            } else {
              while (voice) {
                row = this.pattern.rows[this.position + voice.index];

                if (voice.delay) {
                  if ((row.param & 15) == this.tick) {
                    voice.flags = voice.delay;
                    voice.delay = 0;
                  } else {
                    voice = voice.next;
                    continue;
                  }
                }

                if (row.volume) {
                  paramx = row.volume >> 4;
                  paramy = row.volume & 15;

                  switch (paramx) {
                    case 6:   //vx volums slide down
                      voice.volume -= paramy;
                      if (voice.volume < 0) voice.volume = 0;
                      voice.flags |= UPDATE_VOLUME;
                      break;
                    case 7:   //vx volums slide up
                      voice.volume += paramy;
                      if (voice.volume > 64) voice.volume = 64;
                      voice.flags |= UPDATE_VOLUME;
                      break;
                    case 11:  //vx vibrato
                      voice.vibrato();
                      break;
                    case 13:  //vx panning slide left
                      voice.panning -= paramy;
                      if (voice.panning < 0) voice.panning = 0;
                      voice.flags |= UPDATE_PANNING;
                      break;
                    case 14:  //vx panning slide right
                      voice.panning += paramy;
                      if (voice.panning > 255) voice.panning = 255;
                      voice.flags |= UPDATE_PANNING;
                      break;
                    case 15:  //vx tone portamento
                      if (voice.portaPeriod) voice.tonePortamento();
                      break;
                  }
                }

                paramx = row.param >> 4;
                paramy = row.param & 15;

                switch (row.effect) {
                  case 0:   //fx arpeggio
                    if (!row.param) break;
                    value = (this.tick - this.timer) % 3;
                    if (value < 0) value += 3;
                    if (this.tick == 2 && this.timer == 18) value = 0;

                    if (!value) {
                      voice.arpDelta = 0;
                    } else if (value == 1) {
                      if (this.linear) {
                        voice.arpDelta = -(paramy << 6);
                      } else {
                        value = this.amiga(voice.note + paramy, voice.finetune);
                        voice.arpDelta = value - voice.period;
                      }
                    } else {
                      if (this.linear) {
                        voice.arpDelta = -(paramx << 6);
                      } else {
                        value = this.amiga(voice.note + paramx, voice.finetune);
                        voice.arpDelta = value - voice.period;
                      }
                    }

                    voice.flags |= UPDATE_PERIOD;
                    break;
                  case 1:   //fx portamento up
                    voice.period -= voice.portaU;
                    if (voice.period < 0) voice.period = 0;
                    voice.flags |= UPDATE_PERIOD;
                    break;
                  case 2:   //fx portamento down
                    voice.period += voice.portaD;
                    if (voice.period > 9212) voice.period = 9212;
                    voice.flags |= UPDATE_PERIOD;
                    break;
                  case 3:   //fx tone portamento
                    if (voice.portaPeriod) voice.tonePortamento();
                    break;
                  case 4:   //fx vibrato
                    if (paramx) voice.vibratoSpeed = paramx;
                    if (paramy) voice.vibratoDepth = paramy << 2;
                    voice.vibrato();
                    break;
                  case 5:   //fx tone portamento + volume slide
                    slide = 1;
                    if (voice.portaPeriod) voice.tonePortamento();
                    break;
                  case 6:   //fx vibrato + volume slide
                    slide = 1;
                    voice.vibrato();
                    break;
                  case 7:   //fx tremolo
                    voice.tremolo();
                    break;
                  case 10:  //fx volume slide
                    slide = 1;
                    break;
                  case 14:  //fx extended effects

                    switch (paramx) {
                      case 9:   //ex retrig note
                        if ((this.tick % paramy) == 0) {
                          voice.volEnvelope.reset();
                          voice.panEnvelope.reset();
                          voice.flags |= (UPDATE_VOLUME | UPDATE_PANNING | UPDATE_TRIGGER);
                        }
                        break;
                      case 12:  //ex note cut
                        if (this.tick == paramy) {
                          voice.volume = 0;
                          voice.flags |= UPDATE_VOLUME;
                        }
                        break;
                    }

                    break;
                  case 17:  //fx global volume slide
                    paramx = voice.volSlideMaster >> 4;
                    paramy = voice.volSlideMaster & 15;

                    if (paramx) {
                      this.master += paramx;
                      if (this.master > 64) this.master = 64;
                      voice.flags |= UPDATE_VOLUME;
                    } else if (paramy) {
                      this.master -= paramy;
                      if (this.master < 0) this.master = 0;
                      voice.flags |= UPDATE_VOLUME;
                    }
                    break;
                  case 20:  //fx keyoff
                    if (this.tick == row.param) {
                      voice.fadeEnabled = 1;
                      voice.keyoff = 1;
                    }
                    break;
                  case 24:  //fx panning slide
                    paramx = voice.panSlide >> 4;
                    paramy = voice.panSlide & 15;

                    if (paramx) {
                      voice.panning += paramx;
                      if (voice.panning > 255) voice.panning = 255;
                      voice.flags |= UPDATE_PANNING;
                    } else if (paramy) {
                      voice.panning -= paramy;
                      if (voice.panning < 0) voice.panning = 0;
                      voice.flags |= UPDATE_PANNING;
                    }
                    break;
                  case 27:  //fx multi retrig note
                    com = this.tick;
                    if (!row.volume) com++;
                    if (com % voice.retrigy) break;

                    if ((!row.volume || row.volume > 80) && voice.retrigx) this.retrig(voice);
                    voice.flags |= UPDATE_TRIGGER;
                    break;
                  case 29:  //fx tremor
                    voice.tremor();
                    break;
                }

                if (slide) {
                  paramx = voice.volSlide >> 4;
                  paramy = voice.volSlide & 15;
                  slide = 0;

                  if (paramx) {
                    voice.volume += paramx;
                    voice.flags |= UPDATE_VOLUME;
                  } else if (paramy) {
                    voice.volume -= paramy;
                    voice.flags |= UPDATE_VOLUME;
                  }
                }
                voice = voice.next;
              }
            }

            if (++this.tick >= (this.timer + this.patternDelay)) {
              this.patternDelay = this.tick = 0;

              if (this.nextPosition < 0) {
                this.nextPosition = this.position + this.channels;

                if (this.nextPosition >= this.pattern.size || this.complete) {
                  this.nextOrder = this.order + 1;
                  this.nextPosition = this.patternOffset;

                  if (this.nextOrder >= this.length) {
                    this.nextOrder = this.restart;
                    this.mixer.complete = 1;
                  }
                }
              }
            }
        }},
        fast: {
          value: function() {
            var chan, delta, flags, instr, panning, voice = this.voices[0], volume;

            while (voice) {
              chan  = voice.channel;
              flags = voice.flags;
              voice.flags = 0;

              if (flags & UPDATE_TRIGGER) {
                chan.index    = voice.sampleOffset;
                chan.pointer  = -1;
                chan.dir      =  0;
                chan.fraction =  0;
                chan.sample   = voice.sample;
                chan.length   = voice.sample.length;

                chan.enabled = chan.sample.data ? 1 : 0;
                voice.playing = voice.instrument;
                voice.sampleOffset = 0;
              }

              instr = voice.playing;
              delta = instr.vibratoSpeed ? voice.autoVibrato() : 0;

              volume = voice.volume + voice.volDelta;

              if (instr.volEnabled) {
                if (voice.volEnabled && !voice.volEnvelope.stopped)
                  this.envelope(voice, voice.volEnvelope, instr.volData);

                volume = (volume * voice.volEnvelope.value) >> 6;
                flags |= UPDATE_VOLUME;

                if (voice.fadeEnabled) {
                  voice.fadeVolume -= voice.fadeDelta;

                  if (voice.fadeVolume < 0) {
                    volume = 0;

                    voice.fadeVolume  = 0;
                    voice.fadeEnabled = 0;

                    voice.volEnvelope.value   = 0;
                    voice.volEnvelope.stopped = 1;
                    voice.panEnvelope.stopped = 1;
                  } else {
                    volume = (volume * voice.fadeVolume) >> 16;
                  }
                }
              } else if (voice.keyoff) {
                volume = 0;
                flags |= UPDATE_VOLUME;
              }

              panning = voice.panning;

              if (instr.panEnabled) {
                if (voice.panEnabled && !voice.panEnvelope.stopped)
                  this.envelope(voice, voice.panEnvelope, instr.panData);

                panning = (voice.panEnvelope.value << 2);
                flags |= UPDATE_PANNING;

                if (panning < 0) panning = 0;
                  else if (panning > 255) panning = 255;
              }

              if (flags & UPDATE_VOLUME) {
                if (volume < 0) volume = 0;
                  else if (volume > 64) volume = 64;

                chan.volume = VOLUMES[(volume * this.master) >> 6];
                chan.lvol = chan.volume * chan.lpan;
                chan.rvol = chan.volume * chan.rpan;
              }

              if (flags & UPDATE_PANNING) {
                chan.panning = panning;
                chan.lpan = PANNING[256 - panning];
                chan.rpan = PANNING[panning];

                chan.lvol = chan.volume * chan.lpan;
                chan.rvol = chan.volume * chan.rpan;
              }

              if (flags & UPDATE_PERIOD) {
                delta += voice.period + voice.arpDelta + voice.vibDelta;

                if (this.linear) {
                  chan.speed = (((548077568 * Math.pow(2, ((4608 - delta) / 768))) / this.sampleRate) >> 0) / 65536;
                } else {
                  chan.speed = (((65536 * (14317456 / delta)) / this.sampleRate) >> 0) / 65536;
                }

                chan.delta  = chan.speed >> 0;
                chan.speed -= chan.delta;
              }
              voice = voice.next;
            }
        }},
        accurate: {
          value: function() {
            var chan, delta, flags, instr, lpan, lvol, panning, rpan, rvol, voice = this.voices[0], volume;

            while (voice) {
              chan  = voice.channel;
              flags = voice.flags;
              voice.flags = 0;

              if (flags & UPDATE_TRIGGER) {
                if (chan.sample) {
                  flags |= SHORT_RAMP;
                  chan.mixCounter = 220;
                  chan.oldSample  = null;
                  chan.oldPointer = -1;

                  if (chan.enabled) {
                    chan.oldDir      = chan.dir;
                    chan.oldFraction = chan.fraction;
                    chan.oldSpeed    = chan.speed;
                    chan.oldSample   = chan.sample;
                    chan.oldPointer  = chan.pointer;
                    chan.oldLength   = chan.length;

                    chan.lmixRampD  = chan.lvol;
                    chan.lmixDeltaD = chan.lvol / 220;
                    chan.rmixRampD  = chan.rvol;
                    chan.rmixDeltaD = chan.rvol / 220;
                  }
                }

                chan.dir = 1;
                chan.fraction = 0;
                chan.sample  = voice.sample;
                chan.pointer = voice.sampleOffset;
                chan.length  = voice.sample.length;

                chan.enabled = chan.sample.data ? 1 : 0;
                voice.playing = voice.instrument;
                voice.sampleOffset = 0;
              }

              instr = voice.playing;
              delta = instr.vibratoSpeed ? voice.autoVibrato() : 0;

              volume = voice.volume + voice.volDelta;

              if (instr.volEnabled) {
                if (voice.volEnabled && !voice.volEnvelope.stopped)
                  this.envelope(voice, voice.volEnvelope, instr.volData);

                volume = (volume * voice.volEnvelope.value) >> 6;
                flags |= UPDATE_VOLUME;

                if (voice.fadeEnabled) {
                  voice.fadeVolume -= voice.fadeDelta;

                  if (voice.fadeVolume < 0) {
                    volume = 0;

                    voice.fadeVolume  = 0;
                    voice.fadeEnabled = 0;

                    voice.volEnvelope.value   = 0;
                    voice.volEnvelope.stopped = 1;
                    voice.panEnvelope.stopped = 1;
                  } else {
                    volume = (volume * voice.fadeVolume) >> 16;
                  }
                }
              } else if (voice.keyoff) {
                volume = 0;
                flags |= UPDATE_VOLUME;
              }

              panning = voice.panning;

              if (instr.panEnabled) {
                if (voice.panEnabled && !voice.panEnvelope.stopped)
                  this.envelope(voice, voice.panEnvelope, instr.panData);

                panning = (voice.panEnvelope.value << 2);
                flags |= UPDATE_PANNING;

                if (panning < 0) panning = 0;
                  else if (panning > 255) panning = 255;
              }

              if (!chan.enabled) {
                chan.volCounter = 0;
                chan.panCounter = 0;
                voice = voice.next;
                continue;
              }

              if (flags & UPDATE_VOLUME) {
                if (volume < 0) volume = 0;
                  else if (volume > 64) volume = 64;

                volume = VOLUMES[(volume * this.master) >> 6];
                lvol = volume * PANNING[256 - panning];
                rvol = volume * PANNING[panning];

                if (volume != chan.volume && !chan.mixCounter) {
                  chan.volCounter = (flags & SHORT_RAMP) ? 220 : this.mixer.samplesTick;

                  chan.lvolDelta = (lvol - chan.lvol) / chan.volCounter;
                  chan.rvolDelta = (rvol - chan.rvol) / chan.volCounter;
                } else {
                  chan.lvol = lvol;
                  chan.rvol = rvol;
                }
                chan.volume = volume;
              }

              if (flags & UPDATE_PANNING) {
                lpan = PANNING[256 - panning];
                rpan = PANNING[panning];

                if (panning != chan.panning && !chan.mixCounter && !chan.volCounter) {
                  chan.panCounter = this.mixer.samplesTick;

                  chan.lpanDelta = (lpan - chan.lpan) / chan.panCounter;
                  chan.rpanDelta = (rpan - chan.rpan) / chan.panCounter;
                } else {
                  chan.lpan = lpan;
                  chan.rpan = rpan;
                }
                chan.panning = panning;
              }

              if (flags & UPDATE_PERIOD) {
                delta += voice.period + voice.arpDelta + voice.vibDelta;

                if (this.linear) {
                  chan.speed = (((548077568 * Math.pow(2, ((4608 - delta) / 768))) / this.sampleRate) >> 0) / 65536;
                } else {
                  chan.speed = (((65536 * (14317456 / delta)) / this.sampleRate) >> 0) / 65536;
                }
              }

              if (chan.mixCounter) {
                chan.lmixRampU  = 0.0;
                chan.lmixDeltaU = chan.lvol / 220;
                chan.rmixRampU  = 0.0;
                chan.rmixDeltaU = chan.rvol / 220;
              }
              voice = voice.next;
            }
        }},
        envelope: {
          value: function(voice, envelope, data) {
            var pos = envelope.position, curr = data.points[pos], next;

            if (envelope.frame == curr.frame) {
              if ((data.flags & ENVELOPE_LOOP) && pos == data.loopEnd) {
                pos  = envelope.position = data.loopStart;
                curr = data.points[pos];
                envelope.frame = curr.frame;
              }

              if (pos == (data.total - 1)) {
                envelope.value = curr.value;
                envelope.stopped = 1;
                return;
              }

              if ((data.flags & ENVELOPE_SUSTAIN) && pos == data.sustain && !voice.fadeEnabled) {
                envelope.value = curr.value;
                return;
              }

              envelope.position++;
              next = data.points[envelope.position];

              envelope.delta = (((next.value - curr.value << 8) / (next.frame - curr.frame)) >> 0) || 0;
              envelope.fraction = (curr.value << 8);
            } else {
              envelope.fraction += envelope.delta;
            }

            envelope.value = (envelope.fraction >> 8);
            envelope.frame++;
        }},
        amiga: {
          value: function(note, finetune) {
            var delta = 0.0, period = PERIODS[++note];

            if (finetune < 0) {
              delta = (PERIODS[--note] - period) / 64;
            } else if (finetune > 0) {
              delta = (period - PERIODS[++note]) / 64;
            }

            return (period - (delta * finetune)) >> 0;
        }},
        retrig: {
          value: function(voice) {
            switch (voice.retrigx) {
              case 1:
                voice.volume--;
                break;
              case 2:
                voice.volume++;
                break;
              case 3:
                voice.volume -= 4;
                break;
              case 4:
                voice.volume -= 8;
                break;
              case 5:
                voice.volume -= 16;
                break;
              case 6:
                voice.volume = (voice.volume << 1) / 3;
                break;
              case 7:
                voice.volume >>= 1;
                break;
              case 8:
                voice.volume = voice.sample.volume;
                break;
              case 9:
                voice.volume++;
                break;
              case 10:
                voice.volume += 2;
                break;
              case 11:
                voice.volume += 4;
                break;
              case 12:
                voice.volume += 8;
                break;
              case 13:
                voice.volume += 16;
                break;
              case 14:
                voice.volume = (voice.volume * 3) >> 1;
                break;
              case 15:
                voice.volume <<= 1;
                break;
            }

            if (voice.volume < 0) voice.volume = 0;
              else if (voice.volume > 64) voice.volume = 64;

            voice.flags |= UPDATE_VOLUME;
        }}
      });

      return Object.seal(o);
    }

    var UPDATE_PERIOD    = 1,
        UPDATE_VOLUME    = 2,
        UPDATE_PANNING   = 4,
        UPDATE_TRIGGER   = 8,
        UPDATE_ALL       = 15,
        SHORT_RAMP       = 32,

        ENVELOPE_ON      = 1,
        ENVELOPE_SUSTAIN = 2,
        ENVELOPE_LOOP    = 4,

        LOWER_NOTE       = 0,
        HIGHER_NOTE      = 118,
        KEYOFF_NOTE      = 97,

        AUTOVIBRATO = [
            0, -2, -3, -5, -6, -8, -9,-11,-12,-14,-16,-17,-19,-20,-22,-23,
          -24,-26,-27,-29,-30,-32,-33,-34,-36,-37,-38,-39,-41,-42,-43,-44,
          -45,-46,-47,-48,-49,-50,-51,-52,-53,-54,-55,-56,-56,-57,-58,-59,
          -59,-60,-60,-61,-61,-62,-62,-62,-63,-63,-63,-64,-64,-64,-64,-64,
          -64,-64,-64,-64,-64,-64,-63,-63,-63,-62,-62,-62,-61,-61,-60,-60,
          -59,-59,-58,-57,-56,-56,-55,-54,-53,-52,-51,-50,-49,-48,-47,-46,
          -45,-44,-43,-42,-41,-39,-38,-37,-36,-34,-33,-32,-30,-29,-27,-26,
          -24,-23,-22,-20,-19,-17,-16,-14,-12,-11, -9, -8, -6, -5, -3, -2,
            0,  2,  3,  5,  6,  8,  9, 11, 12, 14, 16, 17, 19, 20, 22, 23,
           24, 26, 27, 29, 30, 32, 33, 34, 36, 37, 38, 39, 41, 42, 43, 44,
           45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 56, 57, 58, 59,
           59, 60, 60, 61, 61, 62, 62, 62, 63, 63, 63, 64, 64, 64, 64, 64,
           64, 64, 64, 64, 64, 64, 63, 63, 63, 62, 62, 62, 61, 61, 60, 60,
           59, 59, 58, 57, 56, 56, 55, 54, 53, 52, 51, 50, 49, 48, 47, 46,
           45, 44, 43, 42, 41, 39, 38, 37, 36, 34, 33, 32, 30, 29, 27, 26,
           24, 23, 22, 20, 19, 17, 16, 14, 12, 11,  9,  8,  6,  5,  3,  2],

        VIBRATO = [
            0, 24, 49, 74, 97,120,141,161,180,197,212,224,235,244,250,253,
          255,253,250,244,235,224,212,197,180,161,141,120, 97, 74, 49, 24],

        PANNING = [
          0.000000,0.044170,0.062489,0.076523,0.088371,0.098821,0.108239,0.116927,0.124977,
          0.132572,0.139741,0.146576,0.153077,0.159335,0.165350,0.171152,0.176772,0.182210,
          0.187496,0.192630,0.197643,0.202503,0.207273,0.211951,0.216477,0.220943,0.225348,
          0.229631,0.233854,0.237985,0.242056,0.246066,0.249985,0.253873,0.257670,0.261437,
          0.265144,0.268819,0.272404,0.275989,0.279482,0.282976,0.286409,0.289781,0.293153,
          0.296464,0.299714,0.302965,0.306185,0.309344,0.312473,0.315602,0.318671,0.321708,
          0.324746,0.327754,0.330700,0.333647,0.336563,0.339449,0.342305,0.345161,0.347986,
          0.350781,0.353545,0.356279,0.359013,0.361717,0.364421,0.367094,0.369737,0.372380,
          0.374992,0.377574,0.380157,0.382708,0.385260,0.387782,0.390303,0.392794,0.395285,
          0.397746,0.400176,0.402606,0.405037,0.407437,0.409836,0.412206,0.414576,0.416915,
          0.419254,0.421563,0.423841,0.426180,0.428458,0.430737,0.432985,0.435263,0.437481,
          0.439729,0.441916,0.444134,0.446321,0.448508,0.450665,0.452852,0.455009,0.457136,
          0.459262,0.461389,0.463485,0.465611,0.467708,0.469773,0.471839,0.473935,0.475970,
          0.478036,0.480072,0.482077,0.484112,0.486117,0.488122,0.490127,0.492101,0.494106,
          0.496051,0.498025,0.500000,0.501944,0.503888,0.505802,0.507746,0.509660,0.511574,
          0.513488,0.515371,0.517255,0.519138,0.521022,0.522905,0.524758,0.526611,0.528465,
          0.530318,0.532140,0.533993,0.535816,0.537639,0.539462,0.541254,0.543046,0.544839,
          0.546631,0.548423,0.550216,0.551978,0.553739,0.555501,0.557263,0.558995,0.560757,
          0.562489,0.564220,0.565952,0.567683,0.569384,0.571116,0.572817,0.574518,0.576220,
          0.577890,0.579592,0.581262,0.582964,0.584634,0.586305,0.587946,0.589617,0.591257,
          0.592928,0.594568,0.596209,0.597849,0.599459,0.601100,0.602710,0.604350,0.605960,
          0.607570,0.609150,0.610760,0.612370,0.613950,0.615560,0.617139,0.618719,0.620268,
          0.621848,0.623428,0.624977,0.626557,0.628106,0.629655,0.631205,0.632754,0.634303,
          0.635822,0.637372,0.638890,0.640440,0.641959,0.643478,0.644966,0.646485,0.648004,
          0.649523,0.651012,0.652500,0.653989,0.655477,0.656966,0.658454,0.659943,0.661431,
          0.662890,0.664378,0.665836,0.667294,0.668783,0.670241,0.671699,0.673127,0.674585,
          0.676043,0.677471,0.678929,0.680357,0.681785,0.683213,0.684641,0.686068,0.687496,
          0.688894,0.690321,0.691749,0.693147,0.694574,0.695972,0.697369,0.698767,0.700164,
          0.701561,0.702928,0.704326,0.705723,0.707110],

        VOLUMES = [
          0.000000,0.005863,0.013701,0.021569,0.029406,0.037244,0.045082,0.052919,0.060757,
          0.068625,0.076463,0.084300,0.092138,0.099976,0.107844,0.115681,0.123519,0.131357,
          0.139194,0.147032,0.154900,0.162738,0.170575,0.178413,0.186251,0.194119,0.201956,
          0.209794,0.217632,0.225469,0.233307,0.241175,0.249013,0.256850,0.264688,0.272526,
          0.280394,0.288231,0.296069,0.303907,0.311744,0.319582,0.327450,0.335288,0.343125,
          0.350963,0.358800,0.366669,0.374506,0.382344,0.390182,0.398019,0.405857,0.413725,
          0.421563,0.429400,0.437238,0.445076,0.452944,0.460781,0.468619,0.476457,0.484294,
          0.492132,0.500000],

        PERIODS = [
          29024,27392,25856,24384,23040,21696,20480,19328,18240,17216,16256,15360,14512,
          13696,12928,12192,11520,10848,10240, 9664, 9120, 8608, 8128, 7680, 7256, 6848,
           6464, 6096, 5760, 5424, 5120, 4832, 4560, 4304, 4064, 3840, 3628, 3424, 3232,
           3048, 2880, 2712, 2560, 2416, 2280, 2152, 2032, 1920, 1814, 1712, 1616, 1524,
           1440, 1356, 1280, 1208, 1140, 1076, 1016,  960,  907,  856,  808,  762,  720,
            678,  640,  604,  570,  538,  508,  480,  453,  428,  404,  381,  360,  339,
            320,  302,  285,  269,  254,  240,  227,  214,  202,  190,  180,  169,  160,
            151,  142,  134,  127,  120,  113,  107,  101,   95,   90,   85,   80,   75,
             71,   67,   63,   60,   57,   53,   50,   48,   45,   42,   40,   38,   36,
             34,   32,   30,   28];

    window.neoart.F2Player = F2Player;
  })();
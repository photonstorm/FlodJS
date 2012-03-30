/*
  Flod JS 2.0
  2012/04/01
  Christian Corti
  Neoart Costa Rica

  Last Update: Flod JS 1.0 - 2012/02/08

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
  OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
  LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR
  IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

  This work is licensed under the Creative Commons Attribution-Noncommercial-Share Alike 3.0 Unported License.
  To view a copy of this license, visit http://creativecommons.org/licenses/by-nc-sa/3.0/ or send a letter to
  Creative Commons, 171 Second Street, Suite 300, San Francisco, California, 94105, USA.
*/
  (function() {
    function S1Voice(idx) {
      return Object.create(null, {
        index        : { value:idx,  writable:true },
        next         : { value:null, writable:true },
        channel      : { value:null, writable:true },
        step         : { value:0,    writable:true },
        row          : { value:0,    writable:true },
        sample       : { value:0,    writable:true },
        samplePtr    : { value:0,    writable:true },
        sampleLen    : { value:0,    writable:true },
        note         : { value:0,    writable:true },
        noteTimer    : { value:0,    writable:true },
        period       : { value:0,    writable:true },
        volume       : { value:0,    writable:true },
        bendTo       : { value:0,    writable:true },
        bendSpeed    : { value:0,    writable:true },
        arpeggioCtr  : { value:0,    writable:true },
        envelopeCtr  : { value:0,    writable:true },
        pitchCtr     : { value:0,    writable:true },
        pitchFallCtr : { value:0,    writable:true },
        sustainCtr   : { value:0,    writable:true },
        phaseTimer   : { value:0,    writable:true },
        phaseSpeed   : { value:0,    writable:true },
        wavePos      : { value:0,    writable:true },
        waveList     : { value:0,    writable:true },
        waveTimer    : { value:0,    writable:true },
        waitCtr      : { value:0,    writable:true },

        initialize: {
          value: function() {
            this.step         =  0;
            this.row          =  0;
            this.sample       =  0;
            this.samplePtr    = -1;
            this.sampleLen    =  0;
            this.note         =  0;
            this.noteTimer    =  0;
            this.period       =  0x9999;
            this.volume       =  0;
            this.bendTo       =  0;
            this.bendSpeed    =  0;
            this.arpeggioCtr  =  0;
            this.envelopeCtr  =  0;
            this.pitchCtr     =  0;
            this.pitchFallCtr =  0;
            this.sustainCtr   =  0;
            this.phaseTimer   =  0;
            this.phaseSpeed   =  0;
            this.wavePos      =  0;
            this.waveList     =  0;
            this.waveTimer    =  0;
            this.waitCtr      =  0;
        }}
      });
    }
    function S1Row() {
      var o = AmigaRow();

      Object.defineProperties(o, {
        speed : { value:0, writable:true }
      });

      return Object.seal(o);
    }
    function S1Sample() {
      var o = AmigaSample();

      Object.defineProperties(o, {
        waveform     : { value:0,    writable:true },
        arpeggio     : { value:null, writable:true },
        attackSpeed  : { value:0,    writable:true },
        attackMax    : { value:0,    writable:true },
        decaySpeed   : { value:0,    writable:true },
        decayMin     : { value:0,    writable:true },
        sustain      : { value:0,    writable:true },
        releaseSpeed : { value:0,    writable:true },
        releaseMin   : { value:0,    writable:true },
        phaseShift   : { value:0,    writable:true },
        phaseSpeed   : { value:0,    writable:true },
        finetune     : { value:0,    writable:true },
        pitchFall    : { value:0,    writable:true }
      });

      o.arpeggio = new Uint8Array(16);
      return Object.seal(o);
    }
    function S1Player(mixer) {
      var o = AmigaPlayer(mixer);

      Object.defineProperties(o, {
        id          : { value:"S1Player" },
        tracksPtr   : { value:null, writable:true },
        tracks      : { value:[],   writable:true },
        patternsPtr : { value:null, writable:true },
        patterns    : { value:[],   writable:true },
        samples     : { value:[],   writable:true },
        waveLists   : { value:null, writable:true },
        speedDef    : { value:0,    writable:true },
        patternDef  : { value:0,    writable:true },
        mix1Speed   : { value:0,    writable:true },
        mix2Speed   : { value:0,    writable:true },
        mix1Dest    : { value:0,    writable:true },
        mix2Dest    : { value:0,    writable:true },
        mix1Source1 : { value:0,    writable:true },
        mix1Source2 : { value:0,    writable:true },
        mix2Source1 : { value:0,    writable:true },
        mix2Source2 : { value:0,    writable:true },
        doFilter    : { value:0,    writable:true },
        doReset     : { value:0,    writable:true },
        voices      : { value:[],   writable:true },
        trackPos    : { value:0,    writable:true },
        trackEnd    : { value:0,    writable:true },
        trackLen    : { value:0,    writable:true },
        patternPos  : { value:0,    writable:true },
        patternEnd  : { value:0,    writable:true },
        patternLen  : { value:0,    writable:true },
        mix1Ctr     : { value:0,    writable:true },
        mix2Ctr     : { value:0,    writable:true },
        mix1Pos     : { value:0,    writable:true },
        mix2Pos     : { value:0,    writable:true },
        audPtr      : { value:0,    writable:true },
        audLen      : { value:0,    writable:true },
        audPer      : { value:0,    writable:true },
        audVol      : { value:0,    writable:true },

        initialize: {
          value: function() {
            var chan, step, voice = this.voices[0];
            this.reset();

            this.speed      = this.speedDef;
            this.tick       = this.speedDef;
            this.trackPos   =  1;
            this.trackEnd   =  0;
            this.patternPos = -1;
            this.patternEnd =  0;
            this.patternLen = this.patternDef;

            this.mix1Ctr = this.mix1Pos = 0;
            this.mix2Ctr = this.mix2Pos = 0;

            while (voice) {
              voice.initialize();
              chan = this.mixer.channels[voice.index];

              voice.channel = chan;
              voice.step    = this.tracksPtr[voice.index];
              step = this.tracks[voice.step];
              voice.row     = this.patternsPtr[step.pattern];
              voice.sample  = this.patterns[voice.row].sample;

              chan.length  = 32;
              chan.period  = voice.period;
              chan.enabled = 1;

              voice = voice.next;
            }
        }},
        loader: {
          value: function(stream) {
            var data, i, id, j, headers, len, position, row, sample, start, step, totInstruments, totPatterns, totSamples, totWaveforms, ver;

            while (stream.bytesAvailable > 8) {
              start = stream.readUshort();
              if (start != 0x41fa) continue;
              j = stream.readUshort();

              start = stream.readUshort();
              if (start != 0xd1e8) continue;
              start = stream.readUshort();

              if (start == 0xffd4) {
                if (j == 0x0fec) ver = SIDMON_0FFA;
                  else if (j == 0x1466) ver = SIDMON_1444;
                    else ver = j;

                position = j + stream.position - 6;
                break;
              }
            }
            if (!position) return;
            stream.position = position;

            id = stream.readString(32);
            if (id != " SID-MON BY R.v.VLIET  (c) 1988 ") return;

            stream.position = position - 44;
            start = stream.readUint();

            for (i = 1; i < 4; ++i)
              this.tracksPtr[i] = ((stream.readUint() - start) / 6) >> 0;

            stream.position = position - 8;
            start = stream.readUint();
            len   = stream.readUint();
            if (len < start) len = stream.length - position;

            totPatterns = (len - start) >> 2;
            this.patternsPtr = new Uint32Array(totPatterns);
            stream.position = position + start + 4;

            for (i = 1; i < totPatterns; ++i) {
              start = (stream.readUint() / 5) >> 0;

              if (start == 0) {
                totPatterns = i;
                break;
              }
              this.patternsPtr[i] = start;
            }

            this.patternsPtr.length = totPatterns;

            stream.position = position - 44;
            start = stream.readUint();
            stream.position = position - 28;
            len = ((stream.readUint() - start) / 6) >> 0;

            this.tracks.length = len;
            stream.position = position + start;

            for (i = 0; i < len; ++i) {
              step = AmigaStep();
              step.pattern = stream.readUint();
              if (step.pattern >= totPatterns) step.pattern = 0;
              stream.readByte();
              step.transpose = stream.readByte();
              if (step.transpose < -99 || step.transpose > 99) step.transpose = 0;
              this.tracks[i] = step;
            }

            stream.position = position - 24;
            start = stream.readUint();
            totWaveforms = stream.readUint() - start;

            for (i = 0; i < 32; ++i) this.mixer.memory[i] = 0;
            this.mixer.store(stream, totWaveforms, position + start);
            totWaveforms >>= 5;

            stream.position = position - 16;
            start = stream.readUint();
            len = (stream.readUint() - start) + 16;
            j = (totWaveforms + 2) << 4;

            this.waveLists = new Uint8Array(len < j ? j : len);
            stream.position = position + start;
            i = 0;

            while (i < j) {
              this.waveLists[i++] = i >> 4;
              this.waveLists[i++] = 0xff;
              this.waveLists[i++] = 0xff;
              this.waveLists[i++] = 0x10;
              i += 12;
            }

            for (i = 16; i < len; ++i)
              this.waveLists[i] = stream.readUbyte();

            stream.position = position - 20;
            stream.position = position + stream.readUint();

            this.mix1Source1 = stream.readUint();
            this.mix2Source1 = stream.readUint();
            this.mix1Source2 = stream.readUint();
            this.mix2Source2 = stream.readUint();
            this.mix1Dest    = stream.readUint();
            this.mix2Dest    = stream.readUint();
            this.patternDef  = stream.readUint();
            this.trackLen    = stream.readUint();
            this.speedDef    = stream.readUint();
            this.mix1Speed   = stream.readUint();
            this.mix2Speed   = stream.readUint();

            if (this.mix1Source1 > totWaveforms) this.mix1Source1 = 0;
            if (this.mix2Source1 > totWaveforms) this.mix2Source1 = 0;
            if (this.mix1Source2 > totWaveforms) this.mix1Source2 = 0;
            if (this.mix2Source2 > totWaveforms) this.mix2Source2 = 0;
            if (this.mix1Dest > totWaveforms) this.mix1Speed = 0;
            if (this.mix2Dest > totWaveforms) this.mix2Speed = 0;
            if (this.speedDef == 0) this.speedDef = 4;

            stream.position = position - 28;
            j = stream.readUint();
            totInstruments = (stream.readUint() - j) >> 5;
            if (totInstruments > 63) totInstruments = 63;
            len = totInstruments + 1;

            stream.position = position - 4;
            start = stream.readUint();

            if (start == 1) {
              stream.position = 0x71c;
              start = stream.readUshort();

              if (start != 0x4dfa) {
                stream.position = 0x6fc;
                start = stream.readUshort();

                if (start != 0x4dfa) {
                  this.version = 0;
                  return;
                }
              }
              stream.position += stream.readUshort();
              this.samples.length = len + 3;

              for (i = 0; i < 3; ++i) {
                sample = S1Sample();
                sample.waveform = 16 + i;
                sample.length   = EMBEDDED[i];
                sample.pointer  = this.mixer.store(stream, sample.length);
                sample.loop     = sample.loopPtr = 0;
                sample.repeat   = 4;
                sample.volume   = 64;
                this.samples[len + i] = sample;
                stream.position += sample.length;
              }
            } else {
              this.samples.length = len;

              stream.position = position + start;
              data = stream.readUint();
              totSamples = (data >> 5) + 15;
              headers = stream.position;
              data += headers;
            }

            sample = S1Sample();
            this.samples[0] = sample;
            stream.position = position + j;

            for (i = 1; i < len; ++i) {
              sample = S1Sample();
              sample.waveform = stream.readUint();
              for (j = 0; j < 16; ++j) sample.arpeggio[j] = stream.readUbyte();

              sample.attackSpeed  = stream.readUbyte();
              sample.attackMax    = stream.readUbyte();
              sample.decaySpeed   = stream.readUbyte();
              sample.decayMin     = stream.readUbyte();
              sample.sustain      = stream.readUbyte();
              stream.readByte();
              sample.releaseSpeed = stream.readUbyte();
              sample.releaseMin   = stream.readUbyte();
              sample.phaseShift   = stream.readUbyte();
              sample.phaseSpeed   = stream.readUbyte();
              sample.finetune     = stream.readUbyte();
              sample.pitchFall    = stream.readByte();

              if (ver == SIDMON_1444) {
                sample.pitchFall = sample.finetune;
                sample.finetune = 0;
              } else {
                if (sample.finetune > 15) sample.finetune = 0;
                sample.finetune *= 67;
              }

              if (sample.phaseShift > totWaveforms) {
                sample.phaseShift = 0;
                sample.phaseSpeed = 0;
              }

              if (sample.waveform > 15) {
                if ((totSamples > 15) && (sample.waveform > totSamples)) {
                  sample.waveform = 0;
                } else {
                  start = headers + ((sample.waveform - 16) << 5);
                  if (start >= stream.length) continue;
                  j = stream.position;

                  stream.position = start;
                  sample.pointer  = stream.readUint();
                  sample.loop     = stream.readUint();
                  sample.length   = stream.readUint();
                  sample.name     = stream.readString(20);

                  if (sample.loop == 0      ||
                      sample.loop == 99999  ||
                      sample.loop == 199999 ||
                      sample.loop >= sample.length) {

                    sample.loop   = 0;
                    sample.repeat = ver == SIDMON_0FFA ? 2 : 4;
                  } else {
                    sample.repeat = sample.length - sample.loop;
                    sample.loop  -= sample.pointer;
                  }

                  sample.length -= sample.pointer;
                  if (sample.length < (sample.loop + sample.repeat))
                    sample.length = sample.loop + sample.repeat;

                  sample.pointer = this.mixer.store(stream, sample.length, data + sample.pointer);
                  if (sample.repeat < 6 || sample.loop == 0) sample.loopPtr = 0;
                    else sample.loopPtr = sample.pointer + sample.loop;

                  stream.position = j;
                }
              } else if (sample.waveform > totWaveforms) {
                sample.waveform = 0;
              }
              this.samples[i] = sample;
            }

            stream.position = position - 12;
            start = stream.readUint();
            len = ((stream.readUint() - start) / 5) >> 0;
            this.patterns.length = len;
            stream.position = position + start;

            for (i = 0; i < len; ++i) {
              row = S1Row();
              row.note   = stream.readUbyte();
              row.sample = stream.readUbyte();
              row.effect = stream.readUbyte();
              row.param  = stream.readUbyte();
              row.speed  = stream.readUbyte();

              if (ver == SIDMON_1444) {
                if (row.note > 0 && row.note < 255) row.note += 469;
                if (row.effect > 0 && row.effect < 255) row.effect += 469;
                if (row.sample > 59) row.sample = totInstruments + (row.sample - 60);
              } else if (row.sample > totInstruments) {
                row.sample = 0;
              }
              this.patterns[i] = row;
            }

            if (ver == SIDMON_1170 || ver == SIDMON_11C6 || ver == SIDMON_1444) {
              if (ver == SIDMON_1170) this.mix1Speed = this.mix2Speed = 0;
              this.doReset = this.doFilter = 0;
            } else {
              this.doReset = this.doFilter = 1;
            }
            this.version = 1;
        }},
        process: {
          value: function() {
            var chan, dst, i, index, memory = this.mixer.memory, row, sample, src1, src2, step, value, voice = this.voices[0];

            while (voice) {
              chan = voice.channel;
              this.audPtr = -1;
              this.audLen = this.audPer = this.audVol = 0;

              if (this.tick == 0) {
                if (this.patternEnd) {
                  if (this.trackEnd) voice.step = this.tracksPtr[voice.index];
                    else voice.step++;

                  step = this.tracks[voice.step];
                  voice.row = this.patternsPtr[step.pattern];
                  if (this.doReset) voice.noteTimer = 0;
                }

                if (voice.noteTimer == 0) {
                  row = this.patterns[voice.row];

                  if (row.sample == 0) {
                    if (row.note) {
                      voice.noteTimer = row.speed;

                      if (voice.waitCtr) {
                        sample = this.samples[voice.sample];
                        this.audPtr = sample.pointer;
                        this.audLen = sample.length;
                        voice.samplePtr = sample.loopPtr;
                        voice.sampleLen = sample.repeat;
                        voice.waitCtr = 1;
                        chan.enabled  = 0;
                      }
                    }
                  } else {
                    sample = this.samples[row.sample];
                    if (voice.waitCtr) chan.enabled = voice.waitCtr = 0;

                    if (sample.waveform > 15) {
                      this.audPtr = sample.pointer;
                      this.audLen = sample.length;
                      voice.samplePtr = sample.loopPtr;
                      voice.sampleLen = sample.repeat;
                      voice.waitCtr = 1;
                    } else {
                      voice.wavePos = 0;
                      voice.waveList = sample.waveform;
                      index = voice.waveList << 4;
                      this.audPtr = this.waveLists[index] << 5;
                      this.audLen = 32;
                      voice.waveTimer = this.waveLists[++index];
                    }

                    voice.noteTimer   = row.speed;
                    voice.sample      = row.sample;
                    voice.envelopeCtr = voice.pitchCtr = voice.pitchFallCtr = 0;
                  }

                  if (row.note) {
                    voice.noteTimer = row.speed;

                    if (row.note != 0xff) {
                      sample = this.samples[voice.sample];
                      step = this.tracks[voice.step];

                      voice.note = row.note + step.transpose;
                      voice.period = this.audPer = PERIODS[1 + sample.finetune + voice.note];
                      voice.phaseSpeed = sample.phaseSpeed;

                      voice.bendSpeed   = voice.volume = 0;
                      voice.envelopeCtr = voice.pitchCtr = voice.pitchFallCtr = 0;

                      switch (row.effect) {
                        case 0:
                          if (row.param == 0) break;
                          sample.attackSpeed = row.param;
                          sample.attackMax   = row.param;
                          voice.waveTimer    = 0;
                          break;
                        case 2:
                          this.speed = row.param;
                          voice.waveTimer = 0;
                          break;
                        case 3:
                          this.patternLen = row.param;
                          voice.waveTimer = 0;
                          break;
                        default:
                          voice.bendTo = row.effect + step.transpose;
                          voice.bendSpeed = row.param;
                          break;
                      }
                    }
                  }
                  voice.row++;
                } else {
                  voice.noteTimer--;
                }
              }
              sample = this.samples[voice.sample];
              this.audVol = voice.volume;

              switch (voice.envelopeCtr) {
                case 8:
                  break;
                case 0:   //attack
                  this.audVol += sample.attackSpeed;

                  if (this.audVol > sample.attackMax) {
                    this.audVol = sample.attackMax;
                    voice.envelopeCtr += 2;
                  }
                  break;
                case 2:   //decay
                  this.audVol -= sample.decaySpeed;

                  if (this.audVol <= sample.decayMin || this.audVol < -256) {
                    this.audVol = sample.decayMin;
                    voice.envelopeCtr += 2;
                    voice.sustainCtr = sample.sustain;
                  }
                  break;
                case 4:   //sustain
                  voice.sustainCtr--;
                  if (voice.sustainCtr == 0 || voice.sustainCtr == -256) voice.envelopeCtr += 2;
                  break;
                case 6:   //release
                  this.audVol -= sample.releaseSpeed;

                  if (this.audVol <= sample.releaseMin || this.audVol < -256) {
                    this.audVol = sample.releaseMin;
                    voice.envelopeCtr = 8;
                  }
                  break;
              }

              voice.volume = this.audVol;
              voice.arpeggioCtr = ++voice.arpeggioCtr & 15;
              index = sample.finetune + sample.arpeggio[voice.arpeggioCtr] + voice.note;
              voice.period = this.audPer = PERIODS[index];

              if (voice.bendSpeed) {
                value = PERIODS[sample.finetune + voice.bendTo];
                index = ~voice.bendSpeed + 1;
                if (index < -128) index &= 255;
                voice.pitchCtr += index;
                voice.period   += voice.pitchCtr;

                if ((index < 0 && voice.period <= value) || (index > 0 && voice.period >= value)) {
                  voice.note   = voice.bendTo;
                  voice.period = value;
                  voice.bendSpeed = 0;
                  voice.pitchCtr  = 0;
                }
              }

              if (sample.phaseShift) {
                if (voice.phaseSpeed) {
                  voice.phaseSpeed--;
                } else {
                  voice.phaseTimer = ++voice.phaseTimer & 31;
                  index = (sample.phaseShift << 5) + voice.phaseTimer;
                  voice.period += memory[index] >> 2;
                }
              }
              voice.pitchFallCtr -= sample.pitchFall;
              if (voice.pitchFallCtr < -256) voice.pitchFallCtr += 256;
              voice.period += voice.pitchFallCtr;

              if (voice.waitCtr == 0) {
                if (voice.waveTimer) {
                  voice.waveTimer--;
                } else {
                  if (voice.wavePos < 16) {
                    index = (voice.waveList << 4) + voice.wavePos;
                    value = this.waveLists[index++];

                    if (value == 0xff) {
                      voice.wavePos = this.waveLists[index] & 254;
                    } else {
                      this.audPtr = value << 5;
                      voice.waveTimer = this.waveLists[index];
                      voice.wavePos += 2;
                    }
                  }
                }
              }
              if (this.audPtr > -1) chan.pointer = this.audPtr;
              if (this.audPer != 0) chan.period  = voice.period;
              if (this.audLen != 0) chan.length  = this.audLen;

              if (sample.volume) chan.volume = sample.volume;
                else chan.volume = this.audVol >> 2;

              chan.enabled = 1;
              voice = voice.next;
            }

            this.trackEnd = this.patternEnd = 0;

            if (++this.tick > this.speed) {
              this.tick = 0;

              if (++this.patternPos == this.patternLen) {
                this.patternPos = 0;
                this.patternEnd = 1;

                if (++this.trackPos == this.trackLen)
                  this.trackPos = this.trackEnd = this.mixer.complete = 1;
              }
            }

            if (this.mix1Speed) {
              if (this.mix1Ctr == 0) {
                this.mix1Ctr = this.mix1Speed;
                index = this.mix1Pos = ++this.mix1Pos & 31;
                dst  = (this.mix1Dest    << 5) + 31;
                src1 = (this.mix1Source1 << 5) + 31;
                src2 =  this.mix1Source2 << 5;

                for (i = 31; i > -1; --i) {
                  memory[dst--] = (memory[src1--] + memory[src2 + index]) >> 1;
                  index = --index & 31;
                }
              }
              this.mix1Ctr--;
            }

            if (this.mix2Speed) {
              if (this.mix2Ctr == 0) {
                this.mix2Ctr = this.mix2Speed;
                index = this.mix2Pos = ++this.mix2Pos & 31;
                dst  = (this.mix2Dest    << 5) + 31;
                src1 = (this.mix2Source1 << 5) + 31;
                src2 =  this.mix2Source2 << 5;

                for (i = 31; i > -1; --i) {
                  memory[dst--] = (memory[src1--] + memory[src2 + index]) >> 1;
                  index = --index & 31;
                }
              }
              this.mix2Ctr--;
            }

            if (this.doFilter) {
              index = this.mix1Pos + 32;
              memory[index] = ~memory[index] + 1;
            }
            voice = this.voices[0];

            while (voice) {
              chan = voice.channel;

              if (voice.waitCtr == 1) {
                voice.waitCtr++;
              } else if (voice.waitCtr == 2) {
                voice.waitCtr++;
                chan.pointer = voice.samplePtr;
                chan.length  = voice.sampleLen;
              }
              voice = voice.next;
            }
        }}
      });

      o.voices[0] = S1Voice(0);
      o.voices[0].next = o.voices[1] = S1Voice(1);
      o.voices[1].next = o.voices[2] = S1Voice(2);
      o.voices[2].next = o.voices[3] = S1Voice(3);

      o.tracksPtr = new Uint32Array(4);
      return Object.seal(o);
    }

    var SIDMON_0FFA = 0x0ffa,
        SIDMON_1170 = 0x1170,
        SIDMON_11C6 = 0x11c6,
        SIDMON_11DC = 0x11dc,
        SIDMON_11E0 = 0x11e0,
        SIDMON_125A = 0x125a,
        SIDMON_1444 = 0x1444,

        EMBEDDED = [1166, 408, 908],

        PERIODS = [0,
          5760,5424,5120,4832,4560,4304,4064,3840,3616,3424,3232,3048,
          2880,2712,2560,2416,2280,2152,2032,1920,1808,1712,1616,1524,
          1440,1356,1280,1208,1140,1076,1016, 960, 904, 856, 808, 762,
           720, 678, 640, 604, 570, 538, 508, 480, 452, 428, 404, 381,
           360, 339, 320, 302, 285, 269, 254, 240, 226, 214, 202, 190,
           180, 170, 160, 151, 143, 135, 127,
           0,0,0,0,0,0,0,
          4028,3806,3584,3394,3204,3013,2855,2696,2538,2395,2268,2141,
          2014,1903,1792,1697,1602,1507,1428,1348,1269,1198,1134,1071,
          1007, 952, 896, 849, 801, 754, 714, 674, 635, 599, 567, 536,
           504, 476, 448, 425, 401, 377, 357, 337, 310, 300, 284, 268,
           252, 238, 224, 213, 201, 189, 179, 169, 159, 150, 142, 134,
           0,0,0,0,0,0,0,
          3993,3773,3552,3364,3175,2987,2830,2672,2515,2374,2248,2122,
          1997,1887,1776,1682,1588,1494,1415,1336,1258,1187,1124,1061,
           999, 944, 888, 841, 794, 747, 708, 668, 629, 594, 562, 531,
           500, 472, 444, 421, 397, 374, 354, 334, 315, 297, 281, 266,
           250, 236, 222, 211, 199, 187, 177, 167, 158, 149, 141, 133,
           0,0,0,0,0,0,0,
          3957,3739,3521,3334,3147,2960,2804,2648,2493,2353,2228,2103,
          1979,1870,1761,1667,1574,1480,1402,1324,1247,1177,1114,1052,
           990, 935, 881, 834, 787, 740, 701, 662, 624, 589, 557, 526,
           495, 468, 441, 417, 394, 370, 351, 331, 312, 295, 279, 263,
           248, 234, 221, 209, 197, 185, 176, 166, 156, 148, 140, 132,
           0,0,0,0,0,0,0,
          3921,3705,3489,3304,3119,2933,2779,2625,2470,2331,2208,2084,
          1961,1853,1745,1652,1560,1467,1390,1313,1235,1166,1104,1042,
           981, 927, 873, 826, 780, 734, 695, 657, 618, 583, 552, 521,
           491, 464, 437, 413, 390, 367, 348, 329, 309, 292, 276, 261,
           246, 232, 219, 207, 195, 184, 174, 165, 155, 146, 138, 131,
           0,0,0,0,0,0,0,
          3886,3671,3457,3274,3090,2907,2754,2601,2448,2310,2188,2065,
          1943,1836,1729,1637,1545,1454,1377,1301,1224,1155,1094,1033,
           972, 918, 865, 819, 773, 727, 689, 651, 612, 578, 547, 517,
           486, 459, 433, 410, 387, 364, 345, 326, 306, 289, 274, 259,
           243, 230, 217, 205, 194, 182, 173, 163, 153, 145, 137, 130,
           0,0,0,0,0,0,0,
          3851,3638,3426,3244,3062,2880,2729,2577,2426,2289,2168,2047,
          1926,1819,1713,1622,1531,1440,1365,1289,1213,1145,1084,1024,
           963, 910, 857, 811, 766, 720, 683, 645, 607, 573, 542, 512,
           482, 455, 429, 406, 383, 360, 342, 323, 304, 287, 271, 256,
           241, 228, 215, 203, 192, 180, 171, 162, 152, 144, 136, 128,
          6848,6464,6096,5760,5424,5120,4832,4560,4304,4064,3840,3616,
          3424,3232,3048,2880,2712,2560,2416,2280,2152,2032,1920,1808,
          1712,1616,1524,1440,1356,1280,1208,1140,1076,1016, 960, 904,
           856, 808, 762, 720, 678, 640, 604, 570, 538, 508, 480, 452,
           428, 404, 381, 360, 339, 320, 302, 285, 269, 254, 240, 226,
           214, 202, 190, 180, 170, 160, 151, 143, 135, 127];

    window.neoart.S1Player = S1Player;
  })();
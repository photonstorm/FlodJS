/*
  Flod JS 2.0
  2012/04/01
  Christian Corti
  Neoart Costa Rica

  Last Update: Flod JS 2.0 - 2012/03/13

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
  OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
  LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR
  IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

  This work is licensed under the Creative Commons Attribution-Noncommercial-Share Alike 3.0 Unported License.
  To view a copy of this license, visit http://creativecommons.org/licenses/by-nc-sa/3.0/ or send a letter to
  Creative Commons, 171 Second Street, Suite 300, San Francisco, California, 94105, USA.
*/
  (function() {
    function DMVoice() {
      return Object.create(null, {
        channel      : { value:null, writable:true },
        sample       : { value:null, writable:true },
        step         : { value:null, writable:true },
        note         : { value:0,    writable:true },
        period       : { value:0,    writable:true },
        val1         : { value:0,    writable:true },
        val2         : { value:0,    writable:true },
        finalPeriod  : { value:0,    writable:true },
        arpeggioStep : { value:0,    writable:true },
        effectCtr    : { value:0,    writable:true },
        pitch        : { value:0,    writable:true },
        pitchCtr     : { value:0,    writable:true },
        pitchStep    : { value:0,    writable:true },
        portamento   : { value:0,    writable:true },
        volume       : { value:0,    writable:true },
        volumeCtr    : { value:0,    writable:true },
        volumeStep   : { value:0,    writable:true },
        mixMute      : { value:0,    writable:true },
        mixPtr       : { value:0,    writable:true },
        mixEnd       : { value:0,    writable:true },
        mixSpeed     : { value:0,    writable:true },
        mixStep      : { value:0,    writable:true },
        mixVolume    : { value:0,    writable:true },

        initialize: {
          value: function() {
            this.sample       = null;
            this.step         = null;
            this.note         = 0;
            this.period       = 0;
            this.val1         = 0;
            this.val2         = 0;
            this.finalPeriod  = 0;
            this.arpeggioStep = 0;
            this.effectCtr    = 0;
            this.pitch        = 0;
            this.pitchCtr     = 0;
            this.pitchStep    = 0;
            this.portamento   = 0;
            this.volume       = 0;
            this.volumeCtr    = 0;
            this.volumeStep   = 0;
            this.mixMute      = 1;
            this.mixPtr       = 0;
            this.mixEnd       = 0;
            this.mixSpeed     = 0;
            this.mixStep      = 0;
            this.mixVolume    = 0;
        }}
      });
    }
    function DMSample() {
      var o = AmigaSample();

      Object.defineProperties(o, {
        wave        : { value:0, writable:true },
        waveLen     : { value:0, writable:true },
        finetune    : { value:0, writable:true },
        arpeggio    : { value:0, writable:true },
        pitch       : { value:0, writable:true },
        pitchDelay  : { value:0, writable:true },
        pitchLoop   : { value:0, writable:true },
        pitchSpeed  : { value:0, writable:true },
        effect      : { value:0, writable:true },
        effectDone  : { value:0, writable:true },
        effectStep  : { value:0, writable:true },
        effectSpeed : { value:0, writable:true },
        source1     : { value:0, writable:true },
        source2     : { value:0, writable:true },
        volumeLoop  : { value:0, writable:true },
        volumeSpeed : { value:0, writable:true }
      });

      return Object.seal(o);
    }
    function DMSong() {
      return Object.create(null, {
        title    : { value:"", writable:true },
        speed    : { value:0,  writable:true },
        length   : { value:0,  writable:true },
        loop     : { value:0,  writable:true },
        loopStep : { value:0,  writable:true },
        tracks   : { value:[], writable:true }
      });
    }
    function DMPlayer(mixer) {
      var o = AmigaPlayer(mixer);

      Object.defineProperties(o, {
        id          : { value:"DMPlayer" },
        songs       : { value:[],   writable:true },
        patterns    : { value:[],   writable:true },
        samples     : { value:[],   writable:true },
        voices      : { value:[],   writable:true },
        buffer1     : { value:0,    writable:true },
        buffer2     : { value:0,    writable:true },
        song1       : { value:0,    writable:true },
        song2       : { value:0,    writable:true },
        trackPos    : { value:0,    writable:true },
        patternPos  : { value:0,    writable:true },
        patternLen  : { value:0,    writable:true },
        patternEnd  : { value:0,    writable:true },
        stepEnd     : { value:0,    writable:true },
        numChannels : { value:0,    writable:true },
        arpeggios   : { value:null, writable:true },
        averages    : { value:null, writable:true },
        volumes     : { value:null, writable:true },
        mixChannel  : { value:null, writable:true },
        mixPeriod   : { value:0,    writable:true },

        initialize: {
          value: function() {
            var chan, i = 0, len, voice;
            this.reset();

            if (this.playSong > 7) this.playSong = 0;

            this.song1  = this.songs[this.playSong];
            this.speed  = this.song1.speed & 0x0f;
            this.speed |= this.speed << 4;
            this.tick  = this.song1.speed;

            this.trackPos    = 0;
            this.patternPos  = 0;
            this.patternLen  = 64;
            this.patternEnd  = 1;
            this.stepEnd     = 1;
            this.numChannels = 4;

            for (; i < 7; ++i) {
              voice = this.voices[i];
              voice.initialize();
              voice.sample  = this.samples[0];

              if (i < 4) {
                chan = this.mixer.channels[i];
                chan.enabled = 0;
                chan.pointer = this.mixer.loopPtr;
                chan.length  = 2;
                chan.period  = 124;
                chan.volume  = 0;

                voice.channel = chan;
              }
            }

            if (this.version == DIGITALMUG_V2) {
              if ((this.playSong & 1) != 0) this.playSong--;
              this.song2 = this.songs[this.playSong + 1];

              this.mixChannel  = AmigaChannel(7);
              this.numChannels = 7;

              chan = this.mixer.channels[3];
              chan.mute    = 0;
              chan.pointer = this.buffer1;
              chan.length  = 350;
              chan.period  = this.mixPeriod;
              chan.volume  = 64;

              len = this.buffer1 + 700;
              for (i = this.buffer1; i < len; ++i) this.mixer.memory[i] = 0;
            }
        }},
        loader: {
          value: function(stream) {
            var data, i = 0, id, index, instr, j, len, position, row, sample, song, step;
            id = stream.readString(24);

            if (id == " MUGICIAN/SOFTEYES 1990 ") this.version = DIGITALMUG_V1;
              else if (id == " MUGICIAN2/SOFTEYES 1990") this.version = DIGITALMUG_V2;
                else return;

            stream.position = 28;
            index = new Uint32Array(8);
            for (; i < 8; ++i) index[i] = stream.readUint();

            stream.position = 76;

            for (i = 0; i < 8; ++i) {
              song = DMSong();
              song.loop     = stream.readUbyte();
              song.loopStep = stream.readUbyte() << 2;
              song.speed    = stream.readUbyte();
              song.length   = stream.readUbyte() << 2;
              song.title    = stream.readString(12);
              this.songs[i] = song;
            }

            stream.position = 204;
            this.lastSong = this.songs.length - 1;

            for (i = 0; i < 8; ++i) {
              song = this.songs[i];
              len  = index[i] << 2;

              for (j = 0; j < len; ++j) {
                step = AmigaStep();
                step.pattern   = stream.readUbyte() << 6;
                step.transpose = stream.readByte();
                song.tracks[j] = step;
              }
            }

            position = stream.position;
            stream.position = 60;
            len = stream.readUint();
            this.samples.length = ++len;
            stream.position = position;

            for (i = 1; i < len; ++i) {
              sample = DMSample();
              sample.wave        = stream.readUbyte();
              sample.waveLen     = stream.readUbyte() << 1;
              sample.volume      = stream.readUbyte();
              sample.volumeSpeed = stream.readUbyte();
              sample.arpeggio    = stream.readUbyte();
              sample.pitch       = stream.readUbyte();
              sample.effectStep  = stream.readUbyte();
              sample.pitchDelay  = stream.readUbyte();
              sample.finetune    = stream.readUbyte() << 6;
              sample.pitchLoop   = stream.readUbyte();
              sample.pitchSpeed  = stream.readUbyte();
              sample.effect      = stream.readUbyte();
              sample.source1     = stream.readUbyte();
              sample.source2     = stream.readUbyte();
              sample.effectSpeed = stream.readUbyte();
              sample.volumeLoop  = stream.readUbyte();
              this.samples[i] = sample;
            }
            this.samples[0] = this.samples[1];

            position = stream.position;
            stream.position = 64;
            len = stream.readUint() << 7;
            stream.position = position;
            this.mixer.store(stream, len);

            position = stream.position;
            stream.position = 68;
            instr = stream.readUint();

            stream.position = 26;
            len = stream.readUshort() << 6;
            this.patterns.length = len;
            stream.position = position + (instr << 5);

            if (instr) instr = position;

            for (i = 0; i < len; ++i) {
              row = AmigaRow();
              row.note   = stream.readUbyte();
              row.sample = stream.readUbyte() & 63;
              row.effect  = stream.readUbyte();
              row.param  = stream.readByte();
              this.patterns[i] = row;
            }

            position = stream.position;
            stream.position = 72;

            if (instr) {
              len = stream.readUint();
              stream.position = position;
              data = this.mixer.store(stream, len);
              position = stream.position;

              this.mixer.memory.length += 350;
              this.buffer1 = this.mixer.memory.length;
              this.mixer.memory.length += 350;
              this.buffer2 = this.mixer.memory.length;
              this.mixer.memory.length += 350;
              this.mixer.loopLen = 8;

              len = this.samples.length;

              for (i = 1; i < len; ++i) {
                sample = this.samples[i];
                if (sample.wave < 32) continue;
                stream.position = instr + ((sample.wave - 32) << 5);

                sample.pointer = stream.readUint();
                sample.length  = stream.readUint() - sample.pointer;
                sample.loop    = stream.readUint();
                sample.name    = stream.readString(12);

                if (sample.loop) {
                  sample.loop  -= sample.pointer;
                  sample.repeat = sample.length - sample.loop;
                  if ((sample.repeat & 1) != 0) sample.repeat--;
                } else {
                  sample.loopPtr = this.mixer.memory.length;
                  sample.repeat  = 8;
                }

                if ((sample.pointer & 1) != 0) sample.pointer--;
                if ((sample.length  & 1) != 0) sample.length--;

                sample.pointer += data;
                if (!sample.loopPtr) sample.loopPtr = sample.pointer + sample.loop;
              }
            } else {
              position += stream.readUint();
            }
            stream.position = 24;

            if (stream.readUshort() == 1) {
              stream.position = position;
              len = stream.length - stream.position;
              if (len > 256) len = 256;
              for (i = 0; i < len; ++i) this.arpeggios[i] = stream.readUbyte();
            }
        }},
        process: {
          value: function() {
            var chan, dst, i = 0, idx, j, len, memory = this.mixer.memory, r, row, src1, src2, sample, value, voice;

            for (; i < this.numChannels; ++i) {
              voice = this.voices[i];
              sample = voice.sample;

              if (i < 3 || this.numChannels == 4) {
                chan = voice.channel;
                if (this.stepEnd) voice.step = this.song1.tracks[this.trackPos + i];

                if (sample.wave > 31) {
                  chan.pointer = sample.loopPtr;
                  chan.length  = sample.repeat;
                }
              } else {
                chan = this.mixChannel;
                if (this.stepEnd) voice.step = this.song2.tracks[this.trackPos + (i - 3)];
              }

              if (this.patternEnd) {
                row = this.patterns[voice.step.pattern + this.patternPos];

                if (row.note) {
                  if (row.effect != 74) {
                    voice.note = row.note;
                    if (row.sample) sample = voice.sample = this.samples[row.sample];
                  }
                  voice.val1 = row.effect < 64 ? 1 : row.effect - 62;
                  voice.val2 = row.param;
                  idx = voice.step.transpose + sample.finetune;

                  if (voice.val1 != 12) {
                    voice.pitch = row.effect;

                    if (voice.val1 == 1) {
                      idx += voice.pitch;
                      if (idx < 0) voice.period = 0;
                        else voice.period = PERIODS[idx];
                    }
                  } else {
                    voice.pitch = row.note;
                    idx += voice.pitch;

                    if (idx < 0) voice.period = 0;
                      else voice.period = PERIODS[idx];
                  }

                  if (voice.val1 == 11) sample.arpeggio = voice.val2 & 7;

                  if (voice.val1 != 12) {
                    if (sample.wave > 31) {
                      chan.pointer  = sample.pointer;
                      chan.length   = sample.length;
                      chan.enabled  = 0;
                      voice.mixPtr  = sample.pointer;
                      voice.mixEnd  = sample.pointer + sample.length;
                      voice.mixMute = 0;
                    } else {
                      dst = sample.wave << 7;
                      chan.pointer = dst;
                      chan.length  = sample.waveLen;
                      if (voice.val1 != 10) chan.enabled = 0;

                      if (this.numChannels == 4) {
                        if (sample.effect != 0 && voice.val1 != 2 && voice.val1 != 4) {
                          len  = dst + 128;
                          src1 = sample.source1 << 7;
                          for (j = dst; j < len; ++j) memory[j] = memory[src1++];

                          sample.effectStep = 0;
                          voice.effectCtr = sample.effectSpeed;
                        }
                      }
                    }
                  }

                  if (voice.val1 != 3 && voice.val1 != 4 && voice.val1 != 12) {
                    voice.volumeCtr  = 1;
                    voice.volumeStep = 0;
                  }

                  voice.arpeggioStep = 0;
                  voice.pitchCtr     = sample.pitchDelay;
                  voice.pitchStep    = 0;
                  voice.portamento   = 0;
                }
              }

              switch (voice.val1) {
                case 0:
                  break;
                case 5:   //pattern length
                  value = voice.val2;
                  if (value > 0 && value < 65) this.patternLen = value;
                  break;
                case 6:   //song speed
                  value  = voice.val2 & 15;
                  value |= value << 4;
                  if (voice.val2 == 0 || voice.val2 > 15) break;
                  this.speed = value;
                  break;
                case 7:   //led filter on
                  this.mixer.filter.active = 1;
                  break;
                case 8:   //led filter off
                  this.mixer.filter.active = 0;
                  break;
                case 13:  //shuffle
                  voice.val1 = 0;
                  value = voice.val2 & 0x0f;
                  if (value == 0) break;
                  value = voice.val2 & 0xf0;
                  if (value == 0) break;
                  this.speed = voice.val2;
                  break;
              }
            }

            for (i = 0; i < this.numChannels; ++i) {
              voice = this.voices[i];
              sample = voice.sample;

              if (this.numChannels == 4) {
                chan = voice.channel;

                if (sample.wave < 32 && sample.effect && !sample.effectDone) {
                  sample.effectDone = 1;

                  if (voice.effectCtr) {
                    voice.effectCtr--;
                  } else {
                    voice.effectCtr = sample.effectSpeed;
                    dst = sample.wave << 7;

                    switch (sample.effect) {
                      case 1:   //filter
                        for (j = 0; j < 127; ++j) {
                          value  = memory[dst];
                          value += memory[dst + 1];
                          memory[dst++] = value >> 1;
                        }
                        break;
                      case 2:   //mixing
                        src1 = sample.source1 << 7;
                        src2 = sample.source2 << 7;
                        idx  = sample.effectStep;
                        len  = sample.waveLen;
                        sample.effectStep = ++sample.effectStep & 127;

                        for (j = 0; j < len; ++j) {
                          value  = memory[src1++];
                          value += memory[src2 + idx];
                          memory[dst++] = value >> 1;
                          idx = ++idx & 127;
                        }
                        break;
                      case 3:   //scr left
                        value = memory[dst];
                        for (j = 0; j < 127; ++j) memory[dst] = memory[++dst];
                        memory[dst] = value;
                        break;
                      case 4:   //scr right
                        dst += 127;
                        value = memory[dst];
                        for (j = 0; j < 127; ++j) memory[dst] = memory[--dst];
                        memory[dst] = value;
                        break;
                      case 5:   //upsample
                        idx = value = dst;
                        for (j = 0; j < 64; ++j) {
                          memory[idx++] = memory[dst++];
                          dst++;
                        }
                        idx = dst = value;
                        idx += 64;
                        for (j = 0; j < 64; ++j) memory[idx++] = memory[dst++];
                        break;
                      case 6:   //downsample
                        src1 = dst + 64;
                        dst += 128;
                        for (j = 0; j < 64; ++j) {
                          memory[--dst] = memory[--src1];
                          memory[--dst] = memory[src1];
                        }
                        break;
                      case 7:   //negate
                        dst += sample.effectStep;
                        memory[dst] = ~memory[dst] + 1;
                        if (++sample.effectStep >= sample.waveLen) sample.effectStep = 0;
                        break;
                      case 8:   //madmix 1
                        sample.effectStep = ++sample.effectStep & 127;
                        src2 = (sample.source2 << 7) + sample.effectStep;
                        idx  = memory[src2];
                        len  = sample.waveLen;
                        value = 3;

                        for (j = 0; j < len; ++j) {
                          src1 = memory[dst] + value;
                          if (src1 < -128) src1 += 256;
                            else if (src1 > 127) src1 -= 256;

                          memory[dst++] = src1;
                          value += idx;

                          if (value < -128) value += 256;
                            else if (value > 127) value -= 256;
                        }
                        break;
                      case 9:   //addition
                        src2 = sample.source2 << 7;
                        len  = sample.waveLen;

                        for (j = 0; j < len; ++j) {
                          value  = memory[src2++];
                          value += memory[dst];
                          if (value > 127) value -= 256;
                          memory[dst++] = value;
                        }
                        break;
                      case 10:  //filter 2
                        for (j = 0; j < 126; ++j) {
                          value  = memory[dst++] * 3;
                          value += memory[dst + 1];
                          memory[dst] = value >> 2;
                        }
                        break;
                      case 11:  //morphing
                        src1 = sample.source1 << 7;
                        src2 = sample.source2 << 7;
                        len  = sample.waveLen;

                        sample.effectStep = ++sample.effectStep & 127;
                        value = sample.effectStep;
                        if (value >= 64) value = 127 - value;
                        idx = (value ^ 255) & 63;

                        for (j = 0; j < len; ++j) {
                          r  = memory[src1++] * value;
                          r += memory[src2++] * idx;
                          memory[dst++] = r >> 6;
                        }
                        break;
                      case 12:  //morph f
                        src1 = sample.source1 << 7;
                        src2 = sample.source2 << 7;
                        len  = sample.waveLen;

                        sample.effectStep = ++sample.effectStep & 31;
                        value = sample.effectStep;
                        if (value >= 16) value = 31 - value;
                        idx = (value ^ 255) & 15;

                        for (j = 0; j < len; ++j) {
                          r  = memory[src1++] * value;
                          r += memory[src2++] * idx;
                          memory[dst++] = r >> 4;
                        }
                        break;
                      case 13:  //filter 3
                        for (j = 0; j < 126; ++j) {
                          value  = memory[dst++];
                          value += memory[dst + 1];
                          memory[dst] = value >> 1;
                        }
                        break;
                      case 14:  //polygate
                        idx = dst + sample.effectStep;
                        memory[idx] = ~memory[idx] + 1;
                        idx = (sample.effectStep + sample.source2) & (sample.waveLen - 1);
                        idx += dst;
                        memory[idx] = ~memory[idx] + 1;
                        if (++sample.effectStep >= sample.waveLen) sample.effectStep = 0;
                        break;
                      case 15:  //colgate
                        idx = dst;
                        for (j = 0; j < 127; ++j) {
                          value  = memory[dst];
                          value += memory[dst + 1];
                          memory[dst++] = value >> 1;
                        }
                        dst = idx;
                        sample.effectStep++;

                        if (sample.effectStep == sample.source2) {
                          sample.effectStep = 0;
                          idx = value = dst;

                          for (j = 0; j < 64; ++j) {
                            memory[idx++] = memory[dst++];
                            dst++;
                          }
                          idx = dst = value;
                          idx += 64;
                          for (j = 0; j < 64; ++j) memory[idx++] = memory[dst++];
                        }
                        break;
                    }
                  }
                }
              } else {
                chan = (i < 3) ? voice.channel : this.mixChannel;
              }

              if (voice.volumeCtr) {
                voice.volumeCtr--;

                if (voice.volumeCtr == 0) {
                  voice.volumeCtr  = sample.volumeSpeed;
                  voice.volumeStep = ++voice.volumeStep & 127;

                  if (voice.volumeStep || sample.volumeLoop) {
                    idx = voice.volumeStep + (sample.volume << 7);
                    value = ~(memory[idx] + 129) + 1;

                    voice.volume = (value & 255) >> 2;
                    chan.volume  = voice.volume;
                  } else {
                    voice.volumeCtr = 0;
                  }
                }
              }
              value = voice.note;

              if (sample.arpeggio) {
                idx = voice.arpeggioStep + (sample.arpeggio << 5);
                value += this.arpeggios[idx];
                voice.arpeggioStep = ++voice.arpeggioStep & 31;
              }

              idx = value + voice.step.transpose + sample.finetune;
              voice.finalPeriod = PERIODS[idx];
              dst = voice.finalPeriod;

              if (voice.val1 == 1 || voice.val1 == 12) {
                value = ~voice.val2 + 1;
                voice.portamento += value;
                voice.finalPeriod += voice.portamento;

                if (voice.val2) {
                  if ((value < 0 && voice.finalPeriod <= voice.period) || (value >= 0 && voice.finalPeriod >= voice.period)) {
                    voice.portamento = voice.period - dst;
                    voice.val2 = 0;
                  }
                }
              }

              if (sample.pitch) {
                if (voice.pitchCtr) {
                  voice.pitchCtr--;
                } else {
                  idx = voice.pitchStep;
                  voice.pitchStep = ++voice.pitchStep & 127;
                  if (voice.pitchStep == 0) voice.pitchStep = sample.pitchLoop;

                  idx += sample.pitch << 7;
                  value = memory[idx];
                  voice.finalPeriod += (~value + 1);
                }
              }
              chan.period = voice.finalPeriod;
            }

            if (this.numChannels > 4) {
              src1 = this.buffer1;
              this.buffer1 = this.buffer2;
              this.buffer2 = src1;

              chan = this.mixer.channels[3];
              chan.pointer = src1;

              for (i = 3; i < 7; ++i) {
                voice = this.voices[i];
                voice.mixStep = 0;

                if (voice.finalPeriod < 125) {
                  voice.mixMute  = 1;
                  voice.mixSpeed = 0;
                } else {
                  j = ((voice.finalPeriod << 8) / this.mixPeriod) & 65535;
                  src2 = ((256 / j) & 255) << 8;
                  dst  = ((256 % j) << 8) & 16777215;
                  voice.mixSpeed = (src2 | ((dst / j) & 255)) << 8;
                }

                if (voice.mixMute) voice.mixVolume = 0;
                  else voice.mixVolume = voice.volume << 8;
              }

              for (i = 0; i < 350; ++i) {
                dst = 0;

                for (j = 3; j < 7; ++j) {
                  voice = this.voices[j];
                  src2 = (memory[voice.mixPtr + (voice.mixStep >> 16)] & 255) + voice.mixVolume;
                  dst += this.volumes[src2];
                  voice.mixStep += voice.mixSpeed;
                }

                memory[src1++] = this.averages[dst];
              }
              chan.length = 350;
              chan.period = this.mixPeriod;
              chan.volume = 64;
            }

            if (--this.tick == 0) {
              this.tick = this.speed & 15;
              this.speed = (this.speed & 240) >> 4;
              this.speed |= (this.tick << 4);
              this.patternEnd = 1;
              this.patternPos++;

              if (this.patternPos == 64 || this.patternPos == this.patternLen) {
                this.patternPos = 0;
                this.stepEnd    = 1;
                this.trackPos  += 4;

                if (this.trackPos == this.song1.length) {
                  this.trackPos = this.song1.loopStep;
                  this.mixer.complete = 1;
                }
              }
            } else {
              this.patternEnd = 0;
              this.stepEnd = 0;
            }

            for (i = 0; i < this.numChannels; ++i) {
              voice = this.voices[i];
              voice.mixPtr += voice.mixStep >> 16;

              sample = voice.sample;
              sample.effectDone = 0;

              if (voice.mixPtr >= voice.mixEnd) {
                if (sample.loop) {
                  voice.mixPtr -= sample.repeat;
                } else {
                  voice.mixPtr  = 0;
                  voice.mixMute = 1;
                }
              }

              if (i < 4) {
                chan = voice.channel;
                chan.enabled = 1;
              }
            }
        }},
        tables: {
          value: function() {
            var i = 0, idx, j, pos = 0, step = 0, v1, v2, vol = 128;

            this.averages = new Int32Array(1024);
            this.volumes  = new Int32Array(16384);
            this.mixPeriod = 203;

            for (; i < 1024; ++i) {
              if (vol > 127) vol -= 256;
              this.averages[i] = vol;
              if (i > 383 && i < 639) vol = ++vol & 255;
            }

            for (i = 0; i < 64; ++i) {
              v1 = -128;
              v2 =  128;

              for (j = 0; j < 256; ++j) {
                vol = ((v1 * step) / 63) + 128;
                idx = pos + v2;
                this.volumes[idx] = vol & 255;

                if (i != 0 && i != 63 && v2 >= 128) --this.volumes[idx];
                v1++;
                v2 = ++v2 & 255;
              }
              pos += 256;
              step++;
            }
        }}
      });

      o.voices[0] = DMVoice();
      o.voices[1] = DMVoice();
      o.voices[2] = DMVoice();
      o.voices[3] = DMVoice();
      o.voices[4] = DMVoice();
      o.voices[5] = DMVoice();
      o.voices[6] = DMVoice();

      o.arpeggios = new Uint8Array(256);
      o.tables();
      return Object.seal(o);
    }

    var DIGITALMUG_V1 = 1,
        DIGITALMUG_V2 = 2,

        PERIODS = [
          3220,3040,2869,2708,2556,2412,2277,2149,2029,1915,1807,1706,
          1610,1520,1434,1354,1278,1206,1139,1075,1014, 957, 904, 853,
           805, 760, 717, 677, 639, 603, 569, 537, 507, 479, 452, 426,
           403, 380, 359, 338, 319, 302, 285, 269, 254, 239, 226, 213,
           201, 190, 179, 169, 160, 151, 142, 134, 127,
          4842,4571,4314,4072,3843,3628,3424,3232,3051,2879,2718,2565,
          2421,2285,2157,2036,1922,1814,1712,1616,1525,1440,1359,1283,
          1211,1143,1079,1018, 961, 907, 856, 808, 763, 720, 679, 641,
           605, 571, 539, 509, 480, 453, 428, 404, 381, 360, 340, 321,
           303, 286, 270, 254, 240, 227, 214, 202, 191, 180, 170, 160,
           151, 143, 135, 127,
          4860,4587,4330,4087,3857,3641,3437,3244,3062,2890,2728,2574,
          2430,2294,2165,2043,1929,1820,1718,1622,1531,1445,1364,1287,
          1215,1147,1082,1022, 964, 910, 859, 811, 765, 722, 682, 644,
           607, 573, 541, 511, 482, 455, 430, 405, 383, 361, 341, 322,
           304, 287, 271, 255, 241, 228, 215, 203, 191, 181, 170, 161,
           152, 143, 135, 128,
          4878,4604,4345,4102,3871,3654,3449,3255,3073,2900,2737,2584,
          2439,2302,2173,2051,1936,1827,1724,1628,1536,1450,1369,1292,
          1219,1151,1086,1025, 968, 914, 862, 814, 768, 725, 684, 646,
           610, 575, 543, 513, 484, 457, 431, 407, 384, 363, 342, 323,
           305, 288, 272, 256, 242, 228, 216, 203, 192, 181, 171, 161,
           152, 144, 136, 128,
          4895,4620,4361,4116,3885,3667,3461,3267,3084,2911,2747,2593,
          2448,2310,2181,2058,1943,1834,1731,1634,1542,1455,1374,1297,
          1224,1155,1090,1029, 971, 917, 865, 817, 771, 728, 687, 648,
           612, 578, 545, 515, 486, 458, 433, 408, 385, 364, 343, 324,
           306, 289, 273, 257, 243, 229, 216, 204, 193, 182, 172, 162,
           153, 144, 136, 129,
          4913,4637,4377,4131,3899,3681,3474,3279,3095,2921,2757,2603,
          2456,2319,2188,2066,1950,1840,1737,1639,1547,1461,1379,1301,
          1228,1159,1094,1033, 975, 920, 868, 820, 774, 730, 689, 651,
           614, 580, 547, 516, 487, 460, 434, 410, 387, 365, 345, 325,
           307, 290, 274, 258, 244, 230, 217, 205, 193, 183, 172, 163,
           154, 145, 137, 129,
          4931,4654,4393,4146,3913,3694,3486,3291,3106,2932,2767,2612,
          2465,2327,2196,2073,1957,1847,1743,1645,1553,1466,1384,1306,
          1233,1163,1098,1037, 978, 923, 872, 823, 777, 733, 692, 653,
           616, 582, 549, 518, 489, 462, 436, 411, 388, 366, 346, 326,
           308, 291, 275, 259, 245, 231, 218, 206, 194, 183, 173, 163,
           154, 145, 137, 130,
          4948,4671,4409,4161,3928,3707,3499,3303,3117,2942,2777,2621,
          2474,2335,2204,2081,1964,1854,1750,1651,1559,1471,1389,1311,
          1237,1168,1102,1040, 982, 927, 875, 826, 779, 736, 694, 655,
           619, 584, 551, 520, 491, 463, 437, 413, 390, 368, 347, 328,
           309, 292, 276, 260, 245, 232, 219, 206, 195, 184, 174, 164,
           155, 146, 138, 130,
          4966,4688,4425,4176,3942,3721,3512,3315,3129,2953,2787,2631,
          2483,2344,2212,2088,1971,1860,1756,1657,1564,1477,1394,1315,
          1242,1172,1106,1044, 985, 930, 878, 829, 782, 738, 697, 658,
           621, 586, 553, 522, 493, 465, 439, 414, 391, 369, 348, 329,
           310, 293, 277, 261, 246, 233, 219, 207, 196, 185, 174, 164,
           155, 146, 138, 131,
          4984,4705,4441,4191,3956,3734,3524,3327,3140,2964,2797,2640,
          2492,2352,2220,2096,1978,1867,1762,1663,1570,1482,1399,1320,
          1246,1176,1110,1048, 989, 934, 881, 832, 785, 741, 699, 660,
           623, 588, 555, 524, 495, 467, 441, 416, 392, 370, 350, 330,
           312, 294, 278, 262, 247, 233, 220, 208, 196, 185, 175, 165,
           156, 147, 139, 131,
          5002,4722,4457,4206,3970,3748,3537,3339,3151,2974,2807,2650,
          2501,2361,2228,2103,1985,1874,1769,1669,1576,1487,1404,1325,
          1251,1180,1114,1052, 993, 937, 884, 835, 788, 744, 702, 662,
           625, 590, 557, 526, 496, 468, 442, 417, 394, 372, 351, 331,
           313, 295, 279, 263, 248, 234, 221, 209, 197, 186, 175, 166,
           156, 148, 139, 131,
          5020,4739,4473,4222,3985,3761,3550,3351,3163,2985,2818,2659,
          2510,2369,2236,2111,1992,1881,1775,1675,1581,1493,1409,1330,
          1255,1185,1118,1055, 996, 940, 887, 838, 791, 746, 704, 665,
           628, 592, 559, 528, 498, 470, 444, 419, 395, 373, 352, 332,
           314, 296, 280, 264, 249, 235, 222, 209, 198, 187, 176, 166,
           157, 148, 140, 132,
          5039,4756,4489,4237,3999,3775,3563,3363,3174,2996,2828,2669,
          2519,2378,2244,2118,2000,1887,1781,1681,1587,1498,1414,1335,
          1260,1189,1122,1059,1000, 944, 891, 841, 794, 749, 707, 667,
           630, 594, 561, 530, 500, 472, 445, 420, 397, 374, 353, 334,
           315, 297, 281, 265, 250, 236, 223, 210, 198, 187, 177, 167,
           157, 149, 140, 132,
          5057,4773,4505,4252,4014,3788,3576,3375,3186,3007,2838,2679,
          2528,2387,2253,2126,2007,1894,1788,1688,1593,1503,1419,1339,
          1264,1193,1126,1063,1003, 947, 894, 844, 796, 752, 710, 670,
           632, 597, 563, 532, 502, 474, 447, 422, 398, 376, 355, 335,
           316, 298, 282, 266, 251, 237, 223, 211, 199, 188, 177, 167,
           158, 149, 141, 133,
          5075,4790,4521,4268,4028,3802,3589,3387,3197,3018,2848,2688,
          2538,2395,2261,2134,2014,1901,1794,1694,1599,1509,1424,1344,
          1269,1198,1130,1067,1007, 951, 897, 847, 799, 754, 712, 672,
           634, 599, 565, 533, 504, 475, 449, 423, 400, 377, 356, 336,
           317, 299, 283, 267, 252, 238, 224, 212, 200, 189, 178, 168,
           159, 150, 141, 133,
          5093,4808,4538,4283,4043,3816,3602,3399,3209,3029,2859,2698,
          2547,2404,2269,2142,2021,1908,1801,1700,1604,1514,1429,1349,
          1273,1202,1134,1071,1011, 954, 900, 850, 802, 757, 715, 675,
           637, 601, 567, 535, 505, 477, 450, 425, 401, 379, 357, 337,
           318, 300, 284, 268, 253, 238, 225, 212, 201, 189, 179, 169,
           159, 150, 142, 134];

    window.neoart.DMPlayer = DMPlayer;
  })();
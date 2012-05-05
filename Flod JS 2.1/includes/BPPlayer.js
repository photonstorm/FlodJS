/*
  Flod JS 2.1
  2012/04/30
  Christian Corti
  Neoart Costa Rica

  Last Update: Flod JS 2.0 - 2012/03/11

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
  OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
  LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR
  IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

  This work is licensed under the Creative Commons Attribution-Noncommercial-Share Alike 3.0 Unported License.
  To view a copy of this license, visit http://creativecommons.org/licenses/by-nc-sa/3.0/ or send a letter to
  Creative Commons, 171 Second Street, Suite 300, San Francisco, California, 94105, USA.
*/
  (function() {
    function BPVoice(idx) {
      return Object.create(null, {
        index        : { value:idx,  writable:true },
        next         : { value:null, writable:true },
        channel      : { value:null, writable:true },
        enabled      : { value:0,    writable:true },
        restart      : { value:0,    writable:true },
        note         : { value:0,    writable:true },
        period       : { value:0,    writable:true },
        sample       : { value:0,    writable:true },
        samplePtr    : { value:0,    writable:true },
        sampleLen    : { value:0,    writable:true },
        synth        : { value:0,    writable:true },
        synthPtr     : { value:0,    writable:true },
        arpeggio     : { value:0,    writable:true },
        autoArpeggio : { value:0,    writable:true },
        autoSlide    : { value:0,    writable:true },
        vibrato      : { value:0,    writable:true },
        volume       : { value:0,    writable:true },
        volumeDef    : { value:0,    writable:true },
        adsrControl  : { value:0,    writable:true },
        adsrPtr      : { value:0,    writable:true },
        adsrCtr      : { value:0,    writable:true },
        lfoControl   : { value:0,    writable:true },
        lfoPtr       : { value:0,    writable:true },
        lfoCtr       : { value:0,    writable:true },
        egControl    : { value:0,    writable:true },
        egPtr        : { value:0,    writable:true },
        egCtr        : { value:0,    writable:true },
        egValue      : { value:0,    writable:true },
        fxControl    : { value:0,    writable:true },
        fxCtr        : { value:0,    writable:true },
        modControl   : { value:0,    writable:true },
        modPtr       : { value:0,    writable:true },
        modCtr       : { value:0,    writable:true },

        initialize: {
          value: function() {
            this.channel      =  null,
            this.enabled      =  0;
            this.restart      =  0;
            this.note         =  0;
            this.period       =  0;
            this.sample       =  0;
            this.samplePtr    =  0;
            this.sampleLen    =  2;
            this.synth        =  0;
            this.synthPtr     = -1;
            this.arpeggio     =  0;
            this.autoArpeggio =  0;
            this.autoSlide    =  0;
            this.vibrato      =  0;
            this.volume       =  0;
            this.volumeDef    =  0;
            this.adsrControl  =  0;
            this.adsrPtr      =  0;
            this.adsrCtr      =  0;
            this.lfoControl   =  0;
            this.lfoPtr       =  0;
            this.lfoCtr       =  0;
            this.egControl    =  0;
            this.egPtr        =  0;
            this.egCtr        =  0;
            this.egValue      =  0;
            this.fxControl    =  0;
            this.fxCtr        =  0;
            this.modControl   =  0;
            this.modPtr       =  0;
            this.modCtr       =  0;
        }}
      });
    }
    function BPSample() {
      var o = AmigaSample();

      Object.defineProperties(o, {
        synth       : { value:0, writable:true },
        table       : { value:0, writable:true },
        adsrControl : { value:0, writable:true },
        adsrTable   : { value:0, writable:true },
        adsrLen     : { value:0, writable:true },
        adsrSpeed   : { value:0, writable:true },
        lfoControl  : { value:0, writable:true },
        lfoTable    : { value:0, writable:true },
        lfoDepth    : { value:0, writable:true },
        lfoLen      : { value:0, writable:true },
        lfoDelay    : { value:0, writable:true },
        lfoSpeed    : { value:0, writable:true },
        egControl   : { value:0, writable:true },
        egTable     : { value:0, writable:true },
        egLen       : { value:0, writable:true },
        egDelay     : { value:0, writable:true },
        egSpeed     : { value:0, writable:true },
        fxControl   : { value:0, writable:true },
        fxDelay     : { value:0, writable:true },
        fxSpeed     : { value:0, writable:true },
        modControl  : { value:0, writable:true },
        modTable    : { value:0, writable:true },
        modLen      : { value:0, writable:true },
        modDelay    : { value:0, writable:true },
        modSpeed    : { value:0, writable:true }
      });

      return Object.seal(o);
    }
    function BPStep() {
      var o = AmigaStep();

      Object.defineProperties(o, {
        soundTranspose: { value:0, writable:true }
      });

      return Object.seal(o);
    }
    function BPPlayer(mixer) {
      var o = AmigaPlayer(mixer);

      Object.defineProperties(o, {
        id          : { value:"BPPlayer" },
        tracks      : { value:[],   writable:true },
        patterns    : { value:[],   writable:true },
        samples     : { value:[],   writable:true },
        length      : { value:0,    writable:true },
        buffer      : { value:null, writable:true },
        voices      : { value:[],   writable:true },
        trackPos    : { value:0,    writable:true },
        patternPos  : { value:0,    writable:true },
        nextPos     : { value:0,    writable:true },
        jumpFlag    : { value:0,    writable:true },
        repeatCtr   : { value:0,    writable:true },
        arpeggioCtr : { value:0,    writable:true },
        vibratoPos  : { value:0,    writable:true },

        initialize: {
          value: function() {
            var i, len, pos, voice = this.voices[0];
            this.reset();

            this.speed       = 6;
            this.tick        = 1;
            this.trackPos    = 0;
            this.patternPos  = 0;
            this.nextPos     = 0;
            this.jumpFlag    = 0;
            this.repeatCtr   = 0;
            this.arpeggioCtr = 1;
            this.vibratoPos  = 0;

            for (i = 0; i < 128; ++i) this.buffer[i] = 0;

            while (voice) {
              voice.initialize();
              voice.channel   = this.mixer.channels[voice.index];
              voice.samplePtr = this.mixer.loopPtr;
              voice = voice.next;
            }
        }},
        restore: {
          value: function() {
            var i, len, pos, voice = this.voices[0];

            while (voice) {
              if (voice.synthPtr > -1) {
                pos = voice.index << 5;
                len = voice.synthPtr + 32;

                for (i = voice.synthPtr; i < len; ++i)
                  this.mixer.memory[i] = this.buffer[pos++];
              }

              voice = voice.next;
            }
        }},
        loader: {
          value: function(stream) {
            var higher = 0, i = 0, id, len, row, sample, step, tables;
            this.title = stream.readString(26);

            id = stream.readString(4);
            if (id == "BPSM") {
              this.version = BPSOUNDMON_V1;
            } else {
              id = id.substr(0, 3);
              if (id == "V.2") this.version = BPSOUNDMON_V2;
                else if (id == "V.3") this.version = BPSOUNDMON_V3;
                  else return;

              stream.position = 29;
              tables = stream.readUbyte();
            }

            this.length = stream.readUshort();

            for (; ++i < 16;) {
              sample = BPSample();

              if (stream.readUbyte() == 0xff) {
                sample.synth   = 1;
                sample.table   = stream.readUbyte();
                sample.pointer = sample.table << 6;
                sample.length  = stream.readUshort() << 1;

                sample.adsrControl = stream.readUbyte();
                sample.adsrTable   = stream.readUbyte() << 6;
                sample.adsrLen     = stream.readUshort();
                sample.adsrSpeed   = stream.readUbyte();
                sample.lfoControl  = stream.readUbyte();
                sample.lfoTable    = stream.readUbyte() << 6;
                sample.lfoDepth    = stream.readUbyte();
                sample.lfoLen      = stream.readUshort();

                if (this.version < BPSOUNDMON_V3) {
                  stream.readByte();
                  sample.lfoDelay  = stream.readUbyte();
                  sample.lfoSpeed  = stream.readUbyte();
                  sample.egControl = stream.readUbyte();
                  sample.egTable   = stream.readUbyte() << 6;
                  stream.readByte();
                  sample.egLen     = stream.readUshort();
                  stream.readByte();
                  sample.egDelay   = stream.readUbyte();
                  sample.egSpeed   = stream.readUbyte();
                  sample.fxSpeed   = 1;
                  sample.modSpeed  = 1;
                  sample.volume    = stream.readUbyte();
                  stream.position += 6;
                } else {
                  sample.lfoDelay   = stream.readUbyte();
                  sample.lfoSpeed   = stream.readUbyte();
                  sample.egControl  = stream.readUbyte();
                  sample.egTable    = stream.readUbyte() << 6;
                  sample.egLen      = stream.readUshort();
                  sample.egDelay    = stream.readUbyte();
                  sample.egSpeed    = stream.readUbyte();
                  sample.fxControl  = stream.readUbyte();
                  sample.fxSpeed    = stream.readUbyte();
                  sample.fxDelay    = stream.readUbyte();
                  sample.modControl = stream.readUbyte();
                  sample.modTable   = stream.readUbyte() << 6;
                  sample.modSpeed   = stream.readUbyte();
                  sample.modDelay   = stream.readUbyte();
                  sample.volume     = stream.readUbyte();
                  sample.modLen     = stream.readUshort();
                }
              } else {
                stream.position--;
                sample.synth  = 0;
                sample.name   = stream.readString(24);
                sample.length = stream.readUshort() << 1;

                if (sample.length) {
                  sample.loop   = stream.readUshort();
                  sample.repeat = stream.readUshort() << 1;
                  sample.volume = stream.readUshort();

                  if ((sample.loop + sample.repeat) >= sample.length)
                    sample.repeat = sample.length - sample.loop;
                } else {
                  sample.pointer--;
                  sample.repeat = 2;
                  stream.position += 6;
                }
              }
              this.samples[i] = sample;
            }

            len = this.length << 2;
            this.tracks.length = len;

            for (i = 0; i < len; ++i) {
              step = BPStep();
              step.pattern = stream.readUshort();
              step.soundTranspose = stream.readByte();
              step.transpose = stream.readByte();
              if (step.pattern > higher) higher = step.pattern;
              this.tracks[i] = step;
            }

            len = higher << 4;
            this.patterns.length = len;

            for (i = 0; i < len; ++i) {
              row = AmigaRow();
              row.note   = stream.readByte();
              row.sample = stream.readUbyte();
              row.effect = row.sample & 0x0f;
              row.sample = (row.sample & 0xf0) >> 4;
              row.param  = stream.readByte();
              this.patterns[i] = row;
            }

            this.mixer.store(stream, tables << 6);

            for (i = 0; ++i < 16;) {
              sample = this.samples[i];
              if (sample.synth || !sample.length) continue;
              sample.pointer = this.mixer.store(stream, sample.length);
              sample.loopPtr = sample.pointer + sample.loop;
            }
        }},
        process: {
          value: function() {
            var chan, data, dst, instr, len, memory = this.mixer.memory, note, option, row, sample, src, step, voice = this.voices[0];
            this.arpeggioCtr = --this.arpeggioCtr & 3;
            this.vibratoPos  = ++this.vibratoPos  & 7;

            while (voice) {
              chan = voice.channel;
              voice.period += voice.autoSlide;

              if (voice.vibrato) chan.period = voice.period + ((VIBRATO[this.vibratoPos] / voice.vibrato) >> 0);
                else chan.period = voice.period;

              chan.pointer = voice.samplePtr;
              chan.length  = voice.sampleLen;

              if (voice.arpeggio || voice.autoArpeggio) {
                note = voice.note;

                if (!this.arpeggioCtr)
                  note += ((voice.arpeggio & 0xf0) >> 4) + ((voice.autoArpeggio & 0xf0) >> 4);
                else if (this.arpeggioCtr == 1)
                  note += (voice.arpeggio & 0x0f) + (voice.autoArpeggio & 0x0f);

                chan.period = voice.period = PERIODS[note + 35];
                voice.restart = 0;
              }

              if (!voice.synth || voice.sample < 0) {
                voice = voice.next;
                continue;
              }
              sample = this.samples[voice.sample];

              if (voice.adsrControl) {
                if (--voice.adsrCtr == 0) {
                  voice.adsrCtr = sample.adsrSpeed;
                  data = (128 + memory[sample.adsrTable + voice.adsrPtr]) >> 2;
                  chan.volume = (data * voice.volume) >> 6;

                  if (++voice.adsrPtr == sample.adsrLen) {
                    voice.adsrPtr = 0;
                    if (voice.adsrControl == 1) voice.adsrControl = 0;
                  }
                }
              }

              if (voice.lfoControl) {
                if (--voice.lfoCtr == 0) {
                  voice.lfoCtr = sample.lfoSpeed;
                  data = memory[sample.lfoTable + voice.lfoPtr];
                  if (sample.lfoDepth) data = (data / sample.lfoDepth) >> 0;
                  chan.period = voice.period + data;

                  if (++voice.lfoPtr == sample.lfoLen) {
                    voice.lfoPtr = 0;
                    if (voice.lfoControl == 1) voice.lfoControl = 0;
                  }
                }
              }

              if (voice.synthPtr < 0) {
                voice = voice.next;
                continue;
              }

              if (voice.egControl) {
                if (--voice.egCtr == 0) {
                  voice.egCtr = sample.egSpeed;
                  data = voice.egValue;
                  voice.egValue = (128 + memory[sample.egTable + voice.egPtr]) >> 3;

                  if (voice.egValue != data) {
                    src = (voice.index << 5) + data;
                    dst = voice.synthPtr + data;

                    if (voice.egValue < data) {
                      data -= voice.egValue;
                      len = dst - data;
                      for (; dst > len;) memory[--dst] = this.buffer[--src];
                    } else {
                      data = voice.egValue - data;
                      len = dst + data;
                      for (; dst < len;) memory[dst++] = ~this.buffer[src++] + 1
                    }
                  }

                  if (++voice.egPtr == sample.egLen) {
                    voice.egPtr = 0;
                    if (voice.egControl == 1) voice.egControl = 0;
                  }
                }
              }

              switch (voice.fxControl) {
                case 0:
                  break;
                case 1:   //averaging
                  if (--voice.fxCtr == 0) {
                    voice.fxCtr = sample.fxSpeed;
                    dst = voice.synthPtr;
                    len = voice.synthPtr + 32;
                    data = dst > 0 ? memory[dst - 1] : 0;

                    for (; dst < len;) {
                      data = (data + memory[dst + 1]) >> 1;
                      memory[dst++] = data;
                    }
                  }
                  break;
                case 2:   //inversion
                  src = (voice.index << 5) + 31;
                  len = voice.synthPtr + 32;
                  data = sample.fxSpeed;

                  for (dst = voice.synthPtr; dst < len; ++dst) {
                    if (this.buffer[src] < memory[dst]) {
                      memory[dst] -= data;
                    } else if (this.buffer[src] > memory[dst]) {
                      memory[dst] += data;
                    }
                    src--;
                  }
                  break;
                case 3:   //backward inversion
                case 5:   //backward transform
                  src = voice.index << 5;
                  len = voice.synthPtr + 32;
                  data = sample.fxSpeed;

                  for (dst = voice.synthPtr; dst < len; ++dst) {
                    if (this.buffer[src] < memory[dst]) {
                      memory[dst] -= data;
                    } else if (this.buffer[src] > memory[dst]) {
                      memory[dst] += data;
                    }
                    src++;
                  }
                  break;
                case 4:   //transform
                  src = voice.synthPtr + 64;
                  len = voice.synthPtr + 32;
                  data = sample.fxSpeed;

                  for (dst = voice.synthPtr; dst < len; ++dst) {
                    if (memory[src] < memory[dst]) {
                      memory[dst] -= data;
                    } else if (memory[src] > memory[dst]) {
                      memory[dst] += data;
                    }
                    src++;
                  }
                  break;
                case 6:   //wave change
                  if (--voice.fxCtr == 0) {
                    voice.fxControl = 0;
                    voice.fxCtr = 1;
                    src = voice.synthPtr + 64;
                    len = voice.synthPtr + 32;
                    for (dst = voice.synthPtr; dst < len; ++dst) memory[dst] = memory[src++];
                  }
                  break;
              }

              if (voice.modControl) {
                if (--voice.modCtr == 0) {
                  voice.modCtr = sample.modSpeed;
                  memory[voice.synthPtr + 32] = memory[sample.modTable + voice.modPtr];

                  if (++voice.modPtr == sample.modLen) {
                    voice.modPtr = 0;
                    if (voice.modControl == 1) voice.modControl = 0;
                  }
                }
              }
              voice = voice.next;
            }

            if (--this.tick == 0) {
              this.tick = this.speed;
              voice = this.voices[0];

              while (voice) {
                chan = voice.channel;
                voice.enabled = 0;

                step   = this.tracks[(this.trackPos << 2) + voice.index];
                row    = this.patterns[this.patternPos + ((step.pattern - 1) << 4)];
                note   = row.note;
                option = row.effect;
                data   = row.param;

                if (note) {
                  voice.autoArpeggio = voice.autoSlide = voice.vibrato = 0;
                  if (option != 10 || (data & 0xf0) == 0) note += step.transpose;
                  voice.note = note;
                  voice.period = PERIODS[note + 35];

                  if (option < 13) voice.restart = voice.volumeDef = 1;
                    else voice.restart = 0;

                  instr = row.sample;
                  if (instr == 0) instr = voice.sample;
                  if (option != 10 || (data & 0x0f) == 0) instr += step.soundTranspose;

                  if (option < 13 && (!voice.synth || (voice.sample != instr))) {
                    voice.sample = instr;
                    voice.enabled = 1;
                  }
                }

                switch (option) {
                  case 0:   //arpeggio once
                    voice.arpeggio = data;
                    break;
                  case 1:   //set volume
                    voice.volume = data;
                    voice.volumeDef = 0;

                    if (this.version < BPSOUNDMON_V3 || !voice.synth)
                      chan.volume = voice.volume;
                    break;
                  case 2:   //set speed
                    this.tick = this.speed = data;
                    break;
                  case 3:   //set filter
                    this.mixer.filter.active = data;
                    break;
                  case 4:   //portamento up
                    voice.period -= data;
                    voice.arpeggio = 0;
                    break;
                  case 5:   //portamento down
                    voice.period += data;
                    voice.arpeggio = 0;
                    break;
                  case 6:   //set vibrato
                    if (this.version == BPSOUNDMON_V3) voice.vibrato = data;
                      else this.repeatCtr = data;
                    break;
                  case 7:   //step jump
                    if (this.version == BPSOUNDMON_V3) {
                      this.nextPos = data;
                      this.jumpFlag = 1;
                    } else if (this.repeatCtr == 0) {
                      this.trackPos = data;
                    }
                    break;
                  case 8:   //set auto slide
                    voice.autoSlide = data;
                    break;
                  case 9:   //set auto arpeggio
                    voice.autoArpeggio = data;
                    if (this.version == BPSOUNDMON_V3) {
                      voice.adsrPtr = 0;
                      if (voice.adsrControl == 0) voice.adsrControl = 1;
                    }
                    break;
                  case 11:  //change effect
                    voice.fxControl = data;
                    break;
                  case 13:  //change inversion
                    voice.autoArpeggio = data;
                    voice.fxControl ^= 1;
                    voice.adsrPtr = 0;
                    if (voice.adsrControl == 0) voice.adsrControl = 1;
                    break;
                  case 14:  //no eg reset
                    voice.autoArpeggio = data;
                    voice.adsrPtr = 0;
                    if (voice.adsrControl == 0) voice.adsrControl = 1;
                    break;
                  case 15:  //no eg and no adsr reset
                    voice.autoArpeggio = data;
                    break;
                }
                voice = voice.next;
              }

              if (this.jumpFlag) {
                this.trackPos   = this.nextPos;
                this.patternPos = this.jumpFlag = 0;
              } else if (++this.patternPos == 16) {
                this.patternPos = 0;

                if (++this.trackPos == this.length) {
                  this.trackPos = 0;
                  this.mixer.complete = 1;
                }
              }
              voice = this.voices[0];

              while (voice) {
                chan = voice.channel;
                if (voice.enabled) chan.enabled = voice.enabled = 0;
                if (voice.restart == 0) {
                  voice = voice.next;
                  continue;
                }

                if (voice.synthPtr > -1) {
                  src = voice.index << 5;
                  len = voice.synthPtr + 32;
                  for (dst = voice.synthPtr; dst < len; ++dst) memory[dst] = this.buffer[src++];
                  voice.synthPtr = -1;
                }
                voice = voice.next;
              }
              voice = this.voices[0];

              while (voice) {
                if (voice.restart == 0 || voice.sample < 0) {
                  voice = voice.next;
                  continue;
                }
                chan = voice.channel;

                chan.period = voice.period;
                voice.restart = 0;
                sample = this.samples[voice.sample];

                if (sample.synth) {
                  voice.synth   = 1;
                  voice.egValue = 0;
                  voice.adsrPtr = voice.lfoPtr = voice.egPtr = voice.modPtr = 0;

                  voice.adsrCtr = 1;
                  voice.lfoCtr  = sample.lfoDelay + 1;
                  voice.egCtr   = sample.egDelay  + 1;
                  voice.fxCtr   = sample.fxDelay  + 1;
                  voice.modCtr  = sample.modDelay + 1;

                  voice.adsrControl = sample.adsrControl;
                  voice.lfoControl  = sample.lfoControl;
                  voice.egControl   = sample.egControl;
                  voice.fxControl   = sample.fxControl;
                  voice.modControl  = sample.modControl;

                  chan.pointer = voice.samplePtr = sample.pointer;
                  chan.length  = voice.sampleLen = sample.length;

                  if (voice.adsrControl) {
                    data = (128 + memory[sample.adsrTable]) >> 2;

                    if (voice.volumeDef) {
                      voice.volume = sample.volume;
                      voice.volumeDef = 0;
                    }

                    chan.volume = (data * voice.volume) >> 6;
                  } else {
                    chan.volume = voice.volumeDef ? sample.volume : voice.volume;
                  }

                  if (voice.egControl || voice.fxControl || voice.modControl) {
                    voice.synthPtr = sample.pointer;
                    dst = voice.index << 5;
                    len = voice.synthPtr + 32;
                    for (src = voice.synthPtr; src < len; ++src) this.buffer[dst++] = memory[src];
                  }
                } else {
                  voice.synth = voice.lfoControl = 0;

                  if (sample.pointer < 0) {
                    voice.samplePtr = this.mixer.loopPtr;
                    voice.sampleLen = 2;
                  } else {
                    chan.pointer = sample.pointer;
                    chan.volume  = voice.volumeDef ? sample.volume : voice.volume;

                    if (sample.repeat != 2) {
                      voice.samplePtr = sample.loopPtr;
                      chan.length = voice.sampleLen = sample.repeat;
                    } else {
                      voice.samplePtr = this.mixer.loopPtr;
                      voice.sampleLen = 2;
                      chan.length = sample.length;
                    }
                  }
                }
                chan.enabled = voice.enabled = 1;
                voice = voice.next;
              }
            }
        }}
      });

      o.voices[0] = BPVoice(0);
      o.voices[0].next = o.voices[1] = BPVoice(1);
      o.voices[1].next = o.voices[2] = BPVoice(2);
      o.voices[2].next = o.voices[3] = BPVoice(3);

      o.buffer = new Int8Array(128);
      return Object.seal(o);
    }

    var BPSOUNDMON_V1 = 1,
        BPSOUNDMON_V2 = 2,
        BPSOUNDMON_V3 = 3,

        PERIODS = [
          6848,6464,6080,5760,5440,5120,4832,4576,4320,4064,3840,3616,
          3424,3232,3040,2880,2720,2560,2416,2288,2160,2032,1920,1808,
          1712,1616,1520,1440,1360,1280,1208,1144,1080,1016, 960, 904,
           856, 808, 760, 720, 680, 640, 604, 572, 540, 508, 480, 452,
           428, 404, 380, 360, 340, 320, 302, 286, 270, 254, 240, 226,
           214, 202, 190, 180, 170, 160, 151, 143, 135, 127, 120, 113,
           107, 101,  95,  90,  85,  80,  76,  72,  68,  64,  60,  57],

        VIBRATO = [0,64,128,64,0,-64,-128,-64];

    window.neoart.BPPlayer = BPPlayer;
  })();
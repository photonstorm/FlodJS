/*
  Flod JS 2.1
  2012/04/30
  Christian Corti
  Neoart Costa Rica

  Last Update: Flod JS 2.0 - 2012/03/26

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
  OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
  LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR
  IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

  This work is licensed under the Creative Commons Attribution-Noncommercial-Share Alike 3.0 Unported License.
  To view a copy of this license, visit http://creativecommons.org/licenses/by-nc-sa/3.0/ or send a letter to
  Creative Commons, 171 Second Street, Suite 300, San Francisco, California, 94105, USA.
*/
  (function() {
    function JHVoice(idx) {
      return Object.create(null, {
        index       : { value:idx,  writable:true },
        next        : { value:null, writable:true },
        channel     : { value:null, writable:true },
        enabled     : { value:0,    writable:true },
        cosoCounter : { value:0,    writable:true },
        cosoSpeed   : { value:0,    writable:true },
        trackPtr    : { value:0,    writable:true },
        trackPos    : { value:0,    writable:true },
        trackTransp : { value:0,    writable:true },
        patternPtr  : { value:0,    writable:true },
        patternPos  : { value:0,    writable:true },
        frqseqPtr   : { value:0,    writable:true },
        frqseqPos   : { value:0,    writable:true },
        volseqPtr   : { value:0,    writable:true },
        volseqPos   : { value:0,    writable:true },
        sample      : { value:0,    writable:true },
        loopPtr     : { value:0,    writable:true },
        repeat      : { value:0,    writable:true },
        tick        : { value:0,    writable:true },
        note        : { value:0,    writable:true },
        transpose   : { value:0,    writable:true },
        info        : { value:0,    writable:true },
        infoPrev    : { value:0,    writable:true },
        volume      : { value:0,    writable:true },
        volCounter  : { value:0,    writable:true },
        volSpeed    : { value:0,    writable:true },
        volSustain  : { value:0,    writable:true },
        volTransp   : { value:0,    writable:true },
        volFade     : { value:0,    writable:true },
        portaDelta  : { value:0,    writable:true },
        vibrato     : { value:0,    writable:true },
        vibDelay    : { value:0,    writable:true },
        vibDelta    : { value:0,    writable:true },
        vibDepth    : { value:0,    writable:true },
        vibSpeed    : { value:0,    writable:true },
        slide       : { value:0,    writable:true },
        sldActive   : { value:0,    writable:true },
        sldDone     : { value:0,    writable:true },
        sldCounter  : { value:0,    writable:true },
        sldSpeed    : { value:0,    writable:true },
        sldDelta    : { value:0,    writable:true },
        sldPointer  : { value:0,    writable:true },
        sldLen      : { value:0,    writable:true },
        sldEnd      : { value:0,    writable:true },
        sldLoopPtr  : { value:0,    writable:true },

        initialize: {
          value: function() {
            this.channel     = null;
            this.enabled     = 0;
            this.cosoCounter = 0;
            this.cosoSpeed   = 0;
            this.trackPtr    = 0
            this.trackPos    = 12;
            this.trackTransp = 0;
            this.patternPtr  = 0;
            this.patternPos  = 0;
            this.frqseqPtr   = 0;
            this.frqseqPos   = 0;
            this.volseqPtr   = 0;
            this.volseqPos   = 0;
            this.sample      = -1;
            this.loopPtr     = 0;
            this.repeat      = 0;
            this.tick        = 0;
            this.note        = 0;
            this.transpose   = 0;
            this.info        = 0;
            this.infoPrev    = 0;
            this.volume      = 0;
            this.volCounter  = 1;
            this.volSpeed    = 1;
            this.volSustain  = 0;
            this.volTransp   = 0;
            this.volFade     = 100;
            this.portaDelta  = 0;
            this.vibrato     = 0;
            this.vibDelay    = 0;
            this.vibDelta    = 0;
            this.vibDepth    = 0;
            this.vibSpeed    = 0;
            this.slide       = 0;
            this.sldActive   = 0;
            this.sldDone     = 0;
            this.sldCounter  = 0;
            this.sldSpeed    = 0;
            this.sldDelta    = 0;
            this.sldPointer  = 0;
            this.sldLen      = 0;
            this.sldEnd      = 0;
            this.sldLoopPtr  = 0;
        }}
      });
    }
    function JHSong() {
      return Object.create(null, {
        pointer : { value:0, writable:true },
        speed   : { value:0, writable:true },
        length  : { value:0, writable:true }
      });
    }
    function JHPlayer(mixer) {
      var o = AmigaPlayer(mixer);

      Object.defineProperties(o, {
        id          : { value:"JHPlayer" },
        songs       : { value:[],   writable:true },
        samples     : { value:[],   writable:true },
        stream      : { value:null, writable:true },
        base        : { value:0,    writable:true },
        patterns    : { value:0,    writable:true },
        patternLen  : { value:0,    writable:true },
        periods     : { value:0,    writable:true },
        frqseqs     : { value:0,    writable:true },
        volseqs     : { value:0,    writable:true },
        samplesData : { value:0,    writable:true },
        song        : { value:null, writable:true },
        voices      : { value:[],   writable:true },
        coso        : { value:0,    writable:true },
        variant     : { value:0,    writable:true },

        initialize: {
          value: function() {
            var voice = this.voices[0];
            this.reset();

            this.song  = this.songs[this.playSong];
            this.speed = this.song.speed;
            this.tick  = (this.coso || this.variant > 1) ? 1 : this.speed;

            while (voice) {
              voice.initialize();
              voice.channel = this.mixer.channels[voice.index];
              voice.trackPtr = this.song.pointer + (voice.index * 3);

              if (this.coso) {
                voice.trackPos   = 0;
                voice.patternPos = 8;
              } else {
                this.stream.position = voice.trackPtr;
                voice.patternPtr = this.patterns + (this.stream.readUbyte() * this.patternLen);
                voice.trackTransp = this.stream.readByte();
                voice.volTransp = this.stream.readByte();

                voice.frqseqPtr = this.base;
                voice.volseqPtr = this.base;
              }

              voice = voice.next;
            }
        }},
        loader: {
          value: function(stream) {
            var headers, i, id, len, pos, sample, song, songsData, tracks, value = 0;

            this.base = this.periods = 0;
            this.coso = (stream.readString(4) == "COSO");

            if (this.coso) {
              for (i = 0; i < 7; ++i) value += stream.readInt();

              if (value == 16942) {
                stream.position = 47;
                value += stream.readUbyte();
              }

              switch (value) {
                case 22666:
                case 18842:
                case 30012:
                case 22466:
                case 3546:
                  this.variant = 1;
                  break;
                case 16948:
                case 18332:
                case 13698:
                  this.variant = 2;
                  break;
                case 18546:   //Wings of Death
                case 13926:
                case 8760:
                case 17242:
                case 11394:
                case 14494:
                case 14392:
                case 13576:  //Dragonflight
                case 6520:
                  this.variant = 3;
                  break;
                default:
                  this.variant = 4;
              }

              this.version = 2;
              stream.position = 4;

              this.frqseqs     = stream.readUint();
              this.volseqs     = stream.readUint();
              this.patterns    = stream.readUint();
              tracks           = stream.readUint();
              songsData        = stream.readUint();
              headers          = stream.readUint();
              this.samplesData = stream.readUint();

              stream.position = 0;
              stream.writeInt(0x1000000);
              stream.writeInt(0xe1);
              stream.writeShort(0xffff);

              len = ((this.samplesData - headers) / 10) - 1;
              this.lastSong = (headers - songsData) / 6;
            } else {
              while (stream.bytesAvailable > 12) {
                value = stream.readUshort();

                switch (value) {
                  case 0x0240:                                                        //andi.w #x,d0
                    value = stream.readUshort();

                    if (value == 0x007f) {                                            //andi.w #$7f,d0
                      stream.position += 2;
                      this.periods = stream.position + stream.readUshort();
                    }
                    break;
                  case 0x7002:                                                        //moveq #2,d0
                  case 0x7003:                                                        //moveq #3,d0
                    this.channels = value & 0xff;
                    value = stream.readUshort();
                    if (value == 0x7600) value = stream.readUshort();                 //moveq #0,d3

                    if (value == 0x41fa) {                                            //lea x,a0
                      stream.position += 4;
                      this.base = stream.position + stream.readUshort();
                    }
                    break;
                  case 0x5446:                                                        //"TF"
                    value = stream.readUshort();

                    if (value == 0x4d58) {                                            //"MX"
                      id = stream.position - 4;
                      stream.position = stream.length;
                    }
                    break;
                }
              }

              if (!id || !this.base || !this.periods) return;
              this.version = 1;

              stream.position = id + 4;
              this.frqseqs = pos = id + 32;
              value = stream.readUshort();
              this.volseqs = (pos += (++value << 6));

              value = stream.readUshort();
              this.patterns = (pos += (++value << 6));
              value = stream.readUshort();
              stream.position += 2;
              this.patternLen = stream.readUshort();
              tracks = (pos += (++value * this.patternLen));

              stream.position -= 4;
              value = stream.readUshort();
              songsData = (pos += (++value * 12));

              stream.position = id + 16;
              this.lastSong = stream.readUshort();
              headers = (pos += (++this.lastSong * 6));

              len = stream.readUshort();
              this.samplesData = pos + (len * 30);
            }

            stream.position = headers;
            this.samples = [];
            value = 0;

            for (i = 0; i < len; ++i) {
              sample = AmigaSample();
              if (!this.coso) sample.name = stream.readString(18);

              sample.pointer = stream.readUint();
              sample.length  = stream.readUshort() << 1;
              if (!this.coso) sample.volume  = stream.readUshort();
              sample.loopPtr = stream.readUshort() + sample.pointer;
              sample.repeat  = stream.readUshort() << 1;

              if (sample.loopPtr & 1) sample.loopPtr--;
              value += sample.length;
              this.samples[i] = sample;
            }

            stream.position = this.samplesData;
            this.mixer.store(stream, value);

            stream.position = songsData;
            this.songs = [];
            value = 0;

            for (i = 0; i < this.lastSong; ++i) {
              song = JHSong();
              song.pointer = stream.readUshort();
              song.length  = stream.readUshort() - song.pointer + 1;
              song.speed   = stream.readUshort();

              song.pointer = (song.pointer * 12) + tracks;
              song.length *= 12;
              if (song.length > 12) this.songs[value++] = song;
            }

            this.lastSong = this.songs.length - 1;

            if (!this.coso) {
              stream.position = 0;
              this.variant = 1;

              while (stream.position < id) {
                value = stream.readUshort();

                if (value == 0xb03c || value == 0x0c00) {                             //cmp.b #x,d0 | cmpi.b #x,d0
                  value = stream.readUshort();

                  if (value == 0x00e5 || value == 0x00e6 || value == 0x00e9) {        //effects
                    this.variant = 2;
                    break;
                  }
                } else if (value == 0x4efb) {                                         //jmp $(pc,d0.w)
                  this.variant = 3;
                  break;
                }
              }
            }

            this.stream = stream;
        }},
        process: {
          value: function() {
            var chan, loop, period, pos1, pos2, sample, value, voice = this.voices[0];

            if (--this.tick == 0) {
              this.tick = this.speed;

              while (voice) {
                chan = voice.channel;

                if (this.coso) {
                  if (--voice.cosoCounter < 0) {
                    voice.cosoCounter = voice.cosoSpeed;

                    do {
                      this.stream.position = voice.patternPos;

                      do {
                        loop = 0;
                        value = this.stream.readByte();

                        if (value == -1) {
                          if (voice.trackPos == this.song.length) {
                            voice.trackPos = 0;
                            this.mixer.complete = 1;
                          }

                          this.stream.position = voice.trackPtr + voice.trackPos;
                          value = this.stream.readUbyte();
                          voice.trackTransp = this.stream.readByte();
                          pos1 = this.stream.readAt(this.stream.position);

                          if ((this.variant > 3) && (pos1 > 127)) {
                            pos2 = (pos1 >> 4) & 15;
                            pos1 &= 15;

                            if (pos2 == 15) {
                              pos2 = 100;

                              if (pos1) {
                                pos2 = (15 - pos1) + 1;
                                pos2 <<= 1;
                                pos1 = pos2;
                                pos2 <<= 1;
                                pos2 += pos1;
                              }

                              voice.volFade = pos2;
                            } else if (pos2 == 8) {
                              this.mixer.complete = 1;
                            } else if (pos2 == 14) {
                              this.speed = pos1;
                            }
                          } else {
                            voice.volTransp = this.stream.readByte();
                          }

                          this.stream.position = this.patterns + (value << 1);
                          voice.patternPos = this.stream.readUshort();
                          voice.trackPos += 12;
                          loop = 1;
                        } else if (value == -2) {
                          voice.cosoCounter = voice.cosoSpeed = this.stream.readUbyte();
                          loop = 3;
                        } else if (value == -3) {
                          voice.cosoCounter = voice.cosoSpeed = this.stream.readUbyte();
                          voice.patternPos = this.stream.position;
                        } else {
                          voice.note = value;
                          voice.info = this.stream.readByte();

                          if (voice.info & 224) voice.infoPrev = this.stream.readByte();

                          voice.patternPos = this.stream.position;
                          voice.portaDelta = 0;

                          if (value >= 0) {
                            if (this.variant == 1) chan.enabled = 0;
                            value = (voice.info & 31) + voice.volTransp;
                            this.stream.position = this.volseqs + (value << 1);
                            this.stream.position = this.stream.readUshort();

                            voice.volCounter = voice.volSpeed = this.stream.readUbyte();
                            voice.volSustain = 0;
                            value = this.stream.readByte();

                            voice.vibSpeed = this.stream.readByte();
                            voice.vibrato  = 64;
                            voice.vibDepth = voice.vibDelta = this.stream.readByte();
                            voice.vibDelay = this.stream.readUbyte();

                            voice.volseqPtr = this.stream.position;
                            voice.volseqPos = 0;

                            if (value != -128) {
                              if (this.variant > 1 && (voice.info & 64)) value = voice.infoPrev;
                              this.stream.position = this.frqseqs + (value << 1);

                              voice.frqseqPtr = this.stream.readUshort();
                              voice.frqseqPos = 0;

                              voice.tick = 0;
                            }
                          }
                        }
                      } while (loop > 2);
                    } while (loop > 0);
                  }
                } else {
                  this.stream.position = voice.patternPtr + voice.patternPos;
                  value = this.stream.readByte();

                  if (voice.patternPos == this.patternLen || (value & 127) == 1) {
                    if (voice.trackPos == this.song.length) {
                      voice.trackPos = 0;
                      this.mixer.complete = 1;
                    }

                    this.stream.position = voice.trackPtr + voice.trackPos;
                    value = this.stream.readUbyte();
                    voice.trackTransp = this.stream.readByte();
                    voice.volTransp = this.stream.readByte();

                    if (voice.volTransp == -128) this.mixer.complete = 1;

                    voice.patternPtr = this.patterns + (value * this.patternLen);
                    voice.patternPos = 0;
                    voice.trackPos += 12;

                    this.stream.position = voice.patternPtr;
                    value = this.stream.readByte();
                  }

                  if (value & 127) {
                    voice.note = value & 127;
                    voice.portaDelta = 0;

                    pos1 = this.stream.position;
                    if (!voice.patternPos) this.stream.position += this.patternLen;
                    this.stream.position -= 2;

                    voice.infoPrev = this.stream.readByte();
                    this.stream.position = pos1;
                    voice.info = this.stream.readByte();

                    if (value >= 0) {
                      if (this.variant == 1) chan.enabled = 0;
                      value = (voice.info & 31) + voice.volTransp;
                      this.stream.position = this.volseqs + (value << 6);

                      voice.volCounter = voice.volSpeed = this.stream.readUbyte();
                      voice.volSustain = 0;
                      value = this.stream.readByte();

                      voice.vibSpeed = this.stream.readByte();
                      voice.vibrato  = 64;
                      voice.vibDepth = voice.vibDelta = this.stream.readByte();
                      voice.vibDelay = this.stream.readUbyte();

                      voice.volseqPtr = this.stream.position;
                      voice.volseqPos = 0;

                      if (this.variant > 1 && (voice.info & 64)) value = voice.infoPrev;

                      voice.frqseqPtr = this.frqseqs + (value << 6);
                      voice.frqseqPos = 0;

                      voice.tick = 0;
                    }
                  }
                  voice.patternPos += 2;
                }
                voice = voice.next;
              }
              voice = this.voices[0];
            }

            while (voice) {
              chan = voice.channel;
              voice.enabled = 0;

              do {
                loop = 0;

                if (voice.tick) {
                  voice.tick--;
                } else {
                  this.stream.position = voice.frqseqPtr + voice.frqseqPos;

                  do {
                    value = this.stream.readByte();
                    if (value == -31) break;
                    loop = 3;

                    if (this.variant == 3 && this.coso) {
                      if (value == -27) {
                        value = -30;
                      } else if (value == -26) {
                        value = -28;
                      }
                    }

                    switch (value) {
                      case -32:
                        voice.frqseqPos = (this.stream.readUbyte() & 63);
                        this.stream.position = voice.frqseqPtr + voice.frqseqPos;
                        break;
                      case -30:
                        sample = this.samples[this.stream.readUbyte()];
                        voice.sample = -1;

                        voice.loopPtr = sample.loopPtr;
                        voice.repeat  = sample.repeat;
                        voice.enabled = 1;

                        chan.enabled = 0;
                        chan.pointer = sample.pointer;
                        chan.length  = sample.length;

                        voice.volseqPos  = 0;
                        voice.volCounter = 1;
                        voice.slide = 0;
                        voice.frqseqPos += 2;
                        break;
                      case -29:
                        voice.vibSpeed = this.stream.readByte();
                        voice.vibDepth = this.stream.readByte();
                        voice.frqseqPos += 3;
                        break;
                      case -28:
                        sample = this.samples[this.stream.readUbyte()];
                        voice.loopPtr = sample.loopPtr;
                        voice.repeat  = sample.repeat;

                        chan.pointer = sample.pointer;
                        chan.length  = sample.length;

                        voice.slide = 0;
                        voice.frqseqPos += 2;
                        break;
                      case -27:
                        if (this.variant < 2) break;
                        sample = this.samples[this.stream.readUbyte()];
                        chan.enabled  = 0;
                        voice.enabled = 1;

                        if (this.variant == 2) {
                          pos1 = this.stream.readUbyte() * sample.length;

                          voice.loopPtr = sample.loopPtr + pos1;
                          voice.repeat  = sample.repeat;

                          chan.pointer = sample.pointer + pos1;
                          chan.length  = sample.length;

                          voice.frqseqPos += 3;
                        } else {
                          voice.sldPointer = sample.pointer;
                          voice.sldEnd = sample.pointer + sample.length;
                          value = this.stream.readUshort();

                          if (value == 0xffff) {
                            voice.sldLoopPtr = sample.length;
                          } else {
                            voice.sldLoopPtr = value << 1;
                          }

                          voice.sldLen     = this.stream.readUshort() << 1;
                          voice.sldDelta   = this.stream.readShort() << 1;
                          voice.sldActive  = 0;
                          voice.sldCounter = 0;
                          voice.sldSpeed   = this.stream.readUbyte();
                          voice.slide      = 1;
                          voice.sldDone    = 0;

                          voice.frqseqPos += 9;
                        }
                        voice.volseqPos  = 0;
                        voice.volCounter = 1;
                        break;
                      case -26:
                        if (this.variant < 3) break;

                        voice.sldLen     = this.stream.readUshort() << 1;
                        voice.sldDelta   = this.stream.readShort() << 1;
                        voice.sldActive  = 0;
                        voice.sldCounter = 0;
                        voice.sldSpeed   = this.stream.readUbyte();
                        voice.sldDone    = 0;

                        voice.frqseqPos += 6;
                        break;
                      case -25:
                        if (this.variant == 1) {
                          voice.frqseqPtr = this.frqseqs + (this.stream.readUbyte() << 6);
                          voice.frqseqPos = 0;

                          this.stream.position = voice.frqseqPtr;
                          loop = 3;
                        } else {
                          value = this.stream.readUbyte();

                          if (value != voice.sample) {
                            sample = this.samples[value];
                            voice.sample = value;

                            voice.loopPtr = sample.loopPtr;
                            voice.repeat  = sample.repeat;
                            voice.enabled = 1;

                            chan.enabled = 0;
                            chan.pointer = sample.pointer;
                            chan.length  = sample.length;
                          }

                          voice.volseqPos  = 0;
                          voice.volCounter = 1;
                          voice.slide = 0;
                          voice.frqseqPos += 2;
                        }
                        break;
                      case -24:
                        voice.tick = this.stream.readUbyte();
                        voice.frqseqPos += 2;
                        loop = 1;
                        break;
                      case -23:
                        if (this.variant < 2) break;
                        sample = this.samples[this.stream.readUbyte()];
                        voice.sample = -1;
                        voice.enabled = 1;

                        pos2 = this.stream.readUbyte();
                        pos1 = this.stream.position;
                        chan.enabled = 0;

                        this.stream.position = this.samplesData + sample.pointer + 4;
                        value = (this.stream.readUshort() * 24) + (this.stream.readUshort() << 2);
                        this.stream.position += (pos2 * 24);

                        voice.loopPtr = this.stream.readUint() & 0xfffffffe;
                        chan.length   = (this.stream.readUint() & 0xfffffffe) - voice.loopPtr;
                        voice.loopPtr += (sample.pointer + value + 8);
                        chan.pointer  = voice.loopPtr;
                        voice.repeat  = 2;

                        this.stream.position = pos1;
                        pos1 = voice.loopPtr + 1;
                        this.mixer.memory[pos1] = this.mixer.memory[voice.loopPtr];

                        voice.volseqPos  = 0;
                        voice.volCounter = 1;
                        voice.slide = 0;
                        voice.frqseqPos += 3;
                        break;
                      default:
                        voice.transpose = value;
                        voice.frqseqPos++;
                        loop = 0;
                    }
                  } while (loop > 2);
                }
              } while (loop > 0);

              if (voice.slide) {
                if (!voice.sldDone) {
                  if (--voice.sldCounter < 0) {
                    voice.sldCounter = voice.sldSpeed;

                    if (voice.sldActive) {
                      value = voice.sldLoopPtr + voice.sldDelta;

                      if (value < 0) {
                        voice.sldDone = 1;
                        value = voice.sldLoopPtr - voice.sldDelta;
                      } else {
                        pos1 = voice.sldPointer + voice.sldLen + value;

                        if (pos1 > voice.sldEnd) {
                          voice.sldDone = 1;
                          value = voice.sldLoopPtr - voice.sldDelta;
                        }
                      }
                      voice.sldLoopPtr = value;
                    } else {
                      voice.sldActive = 1;
                    }

                    voice.loopPtr = voice.sldPointer + voice.sldLoopPtr;
                    voice.repeat  = voice.sldLen;
                    chan.pointer  = voice.loopPtr;
                    chan.length   = voice.repeat;
                  }
                }
              }

              do {
                loop = 0;

                if (voice.volSustain) {
                  voice.volSustain--;
                } else {
                  if (--voice.volCounter) break;
                  voice.volCounter = voice.volSpeed;

                  do {
                    this.stream.position = voice.volseqPtr + voice.volseqPos;
                    value = this.stream.readByte();
                    if (value <= -25 && value >= -31) break;

                    switch (value) {
                      case -24:
                        voice.volSustain = this.stream.readUbyte();
                        voice.volseqPos += 2;
                        loop = 1;
                        break;
                      case -32:
                        voice.volseqPos = (this.stream.readUbyte() & 63) - 5;
                        loop = 3;
                        break;
                      default:
                        voice.volume = value;
                        voice.volseqPos++;
                        loop = 0;
                    }
                  } while (loop > 2);
                }
              } while (loop > 0);

              value = voice.transpose;
              if (value >= 0) value += (voice.note + voice.trackTransp);
              value &= 127;

              if (this.coso) {
                if (value > 83) value = 0;
                period = PERIODS[value];
                value <<= 1;
              } else {
                value <<= 1;
                this.stream.position = this.periods + value;
                period = this.stream.readUshort();
              }

              if (voice.vibDelay) {
                voice.vibDelay--;
              } else {
                if (this.variant > 3) {
                  if (voice.vibrato & 32) {
                    value = voice.vibDelta + voice.vibSpeed;

                    if (value > voice.vibDepth) {
                      voice.vibrato &= ~32;
                      value = voice.vibDepth;
                    }
                  } else {
                    value = voice.vibDelta - voice.vibSpeed;

                    if (value < 0) {
                      voice.vibrato |= 32;
                      value = 0;
                    }
                  }

                  voice.vibDelta = value;
                  value = (value - (voice.vibDepth >> 1)) * period;
                  period += (value >> 10);
                } else if (this.variant > 2) {
                  value = voice.vibSpeed;

                  if (value < 0) {
                    value &= 127;
                    voice.vibrato ^= 1;
                  }

                  if (!(voice.vibrato & 1)) {
                    if (voice.vibrato & 32) {
                      voice.vibDelta += value;
                      pos1 = voice.vibDepth << 1;

                      if (voice.vibDelta > pos1) {
                        voice.vibrato &= ~32;
                        voice.vibDelta = pos1;
                      }
                    } else {
                      voice.vibDelta -= value;

                      if (voice.vibDelta < 0) {
                        voice.vibrato |= 32;
                        voice.vibDelta = 0;
                      }
                    }
                  }

                  period += (value - voice.vibDepth);
                } else {
                  if (voice.vibrato >= 0 || !(voice.vibrato & 1)) {
                    if (voice.vibrato & 32) {
                      voice.vibDelta += voice.vibSpeed;
                      pos1 = voice.vibDepth << 1;

                      if (voice.vibDelta >= pos1) {
                        voice.vibrato &= ~32;
                        voice.vibDelta = pos1;
                      }
                    } else {
                      voice.vibDelta -= voice.vibSpeed;

                      if (voice.vibDelta < 0) {
                        voice.vibrato |= 32;
                        voice.vibDelta = 0;
                      }
                    }
                  }

                  pos1 = voice.vibDelta - voice.vibDepth;

                  if (pos1) {
                    value += 160;

                    while (value < 256) {
                      pos1 += pos1;
                      value += 24;
                    }

                    period += pos1;
                  }
                }
              }

              if (this.variant < 3) voice.vibrato ^= 1;

              if (voice.info & 32) {
                value = voice.infoPrev;

                if (this.variant > 3) {
                  if (value < 0) {
                    voice.portaDelta += (-value);
                    value = voice.portaDelta * period;
                    period += (value >> 10);
                  } else {
                    voice.portaDelta += value;
                    value = voice.portaDelta * period;
                    period -= (value >> 10);
                  }
                } else {
                  if (value < 0) {
                    voice.portaDelta += (-value << 11);
                    period += (voice.portaDelta >> 16);
                  } else {
                    voice.portaDelta += (value << 11);
                    period -= (voice.portaDelta >> 16);
                  }
                }
              }

              if (this.variant > 3) {
                value = (voice.volFade * voice.volume) / 100;
              } else {
                value = voice.volume;
              }

              chan.period = period;
              chan.volume = value;

              if (voice.enabled) {
                chan.enabled = 1;
                chan.pointer = voice.loopPtr;
                chan.length  = voice.repeat;
              }

              voice = voice.next;
            }
        }}
      });

      o.voices[0] = JHVoice(0);
      o.voices[0].next = o.voices[1] = JHVoice(1);
      o.voices[1].next = o.voices[2] = JHVoice(2);
      o.voices[2].next = o.voices[3] = JHVoice(3);

      return Object.seal(o);
    }

    var PERIODS = [
          1712,1616,1524,1440,1356,1280,1208,1140,1076,1016,
           960, 906, 856, 808, 762, 720, 678, 640, 604, 570,
           538, 508, 480, 453, 428, 404, 381, 360, 339, 320,
           302, 285, 269, 254, 240, 226, 214, 202, 190, 180,
           170, 160, 151, 143, 135, 127, 120, 113, 113, 113,
           113, 113, 113, 113, 113, 113, 113, 113, 113, 113,
          3424,3232,3048,2880,2712,2560,2416,2280,2152,2032,
          1920,1812,6848,6464,6096,5760,5424,5120,4832,4560,
          4304,4064,3840,3624];

    window.neoart.JHPlayer = JHPlayer;
  })();
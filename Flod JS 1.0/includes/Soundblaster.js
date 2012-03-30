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
  function SBChannel() {
    return Object.create(null, {
      next:        { value:null, writable:true },
      mute:        { value:0,    writable:true },
      enabled:     { value:0,    writable:true },
      sample:      { value:null, writable:true },
      length:      { value:0,    writable:true },
      index:       { value:0,    writable:true },
      pointer:     { value:0,    writable:true },
      delta:       { value:0,    writable:true },
      fraction:    { value:0.0,  writable:true },
      speed:       { value:0.0,  writable:true },
      dir:         { value:0,    writable:true },
      oldSample:   { value:null, writable:true },
      oldLength:   { value:0,    writable:true },
      oldPointer:  { value:0,    writable:true },
      oldFraction: { value:0.0,  writable:true },
      oldSpeed:    { value:0.0,  writable:true },
      oldDir:      { value:0,    writable:true },
      volume:      { value:0.0,  writable:true },
      lvol:        { value:0.0,  writable:true },
      rvol:        { value:0.0,  writable:true },
      panning:     { value:128,  writable:true },
      lpan:        { value:0.5,  writable:true },
      rpan:        { value:0.5,  writable:true },
      ldata:       { value:0.0,  writable:true },
      rdata:       { value:0.0,  writable:true },
      mixCounter:  { value:0,    writable:true },
      lmixRampU:   { value:0.0,  writable:true },
      lmixDeltaU:  { value:0.0,  writable:true },
      rmixRampU:   { value:0.0,  writable:true },
      rmixDeltaU:  { value:0.0,  writable:true },
      lmixRampD:   { value:0.0,  writable:true },
      lmixDeltaD:  { value:0.0,  writable:true },
      rmixRampD:   { value:0.0,  writable:true },
      rmixDeltaD:  { value:0.0,  writable:true },
      volCounter:  { value:0,    writable:true },
      lvolDelta:   { value:0.0,  writable:true },
      rvolDelta:   { value:0.0,  writable:true },
      panCounter:  { value:0,    writable:true },
      lpanDelta:   { value:0.0,  writable:true },
      rpanDelta:   { value:0.0,  writable:true },

      initialize: {
        value: function() {
          this.enabled     = 0;
          this.sample      = null;
          this.length      = 0;
          this.index       = 0;
          this.pointer     = 0;
          this.delta       = 0;
          this.fraction    = 0.0;
          this.speed       = 0.0;
          this.dir         = 0;
          this.oldSample   = null;
          this.oldLength   = 0;
          this.oldPointer  = 0;
          this.oldFraction = 0.0;
          this.oldSpeed    = 0.0;
          this.oldDir      = 0;
          this.volume      = 0.0;
          this.lvol        = 0.0;
          this.rvol        = 0.0;
          this.panning     = 128
          this.lpan        = 0.5;
          this.rpan        = 0.5;
          this.ldata       = 0.0;
          this.rdata       = 0.0;
          this.mixCounter  = 0;
          this.lmixRampU   = 0.0;
          this.lmixDeltaU  = 0.0;
          this.rmixRampU   = 0.0;
          this.rmixDeltaU  = 0.0;
          this.lmixRampD   = 0.0;
          this.lmixDeltaD  = 0.0;
          this.rmixRampD   = 0.0;
          this.rmixDeltaD  = 0.0;
          this.volCounter  = 0;
          this.lvolDelta   = 0.0;
          this.rvolDelta   = 0.0;
          this.panCounter  = 0;
          this.lpanDelta   = 0.0;
          this.rpanDelta   = 0.0;
      }}
    });
  }
  function SBSample() {
    return Object.create(null, {
      name:      { value:"", writable:true },
      bits:      { value:8,  writable:true },
      volume:    { value:0,  writable:true },
      length:    { value:0,  writable:true },
      data:      { value:[], writable:true },
      loopMode:  { value:0,  writable:true },
      loopStart: { value:0,  writable:true },
      loopLen:   { value:0,  writable:true },

      store: {
        value: function(stream) {
          var delta = 0, i, len = this.length, pos, sample, total, value;
          if (!this.loopLen) this.loopMode = 0;
          pos = stream.position;

          if (this.loopMode) {
            len = this.loopStart + this.loopLen;
            this.data = new Float32Array(len + 1);
          } else {
            this.data = new Float32Array(this.length + 1);
          }

          if (this.bits == 8) {
            total = pos + len;

            if (total > stream.length)
              len = stream.length - pos;

            for (i = 0; i < len; i++) {
              value = stream.readByte() + delta;

              if (value < -128) value += 256;
                else if (value > 127) value -= 256;

              this.data[i] = value * 0.0078125;
              delta = value;
            }
          } else {
            total = pos + (len << 1);

            if (total > stream.length)
              len = (stream.length - pos) >> 1;

            for (i = 0; i < len; i++) {
              value = stream.readShort() + delta;

              if (value < -32768) value += 65536;
                else if (value > 32767) value -= 65536;

              this.data[i] = value * 0.00003051758;
              delta = value;
            }
          }

          total = pos + length;

          if (!this.loopMode) {
            this.data[this.length] = 0.0;
          } else {
            this.length = this.loopStart + this.loopLen;

            if (this.loopMode == 1) {
              this.data[len] = this.data[this.loopStart];
            } else {
              this.data[len] = this.data[len - 1];
            }
          }

          if (len != this.length) {
            sample = this.data[len - 1];
            for (i = len; i < this.length; i++) this.data[i] = sample;
          }

          if (total < stream.length) stream.position = total;
            else stream.position = stream.length - 1;
      }}
    });
  }
  function Soundblaster() {
    var o = CoreMixer();

    Object.defineProperties(o, {
      setup: {
        value: function(len) {
          var i = 1;
          this.channels.length = len;
          this.channels[0] = SBChannel();

          for (; i < len; ++i)
            this.channels[i] = this.channels[i - 1].next = SBChannel();
      }},
      initialize: {
        value: function() {
          this.reset();
      }},
      fast: {
        value: function(e) {
          var chan, d, ldata, i, mixed = 0, mixLen, mixPos = 0, rdata, s, sample, size = this.bufferSize, toMix, value;

          if (this.completed) {
            if (!this.remains) {
              this.player.stop();
              return;
            }
            size = this.remains;
          }

          while (mixed < size) {
            if (!this.samplesLeft) {
              this.player.process();
              this.player.fast();
              this.samplesLeft = this.samplesTick;

              if (this.completed) {
                size = mixed + this.samplesTick;

                if (size > this.bufferSize) {
                  this.remains = size - this.bufferSize;
                  size = this.bufferSize;
                }
              }
            }

            toMix = this.samplesLeft;
            if ((mixed + toMix) >= size) toMix = size - mixed;
            mixLen = mixPos + toMix;
            chan = this.channels[0];

            while (chan) {
              if (!chan.enabled) {
                chan = chan.next;
                continue;
              }

              s = chan.sample;
              d = s.data;
              sample = this.buffer[mixPos];

              for (i = mixPos; i < mixLen; ++i) {
                if (chan.index != chan.pointer) {
                  if (chan.index >= chan.length) {
                    if (!s.loopMode) {
                      chan.enabled = 0;
                      break;
                    } else {
                      chan.pointer = s.loopStart + (chan.index - chan.length);
                      chan.length  = s.length;

                      if (s.loopMode == 2) {
                        if (!chan.dir) {
                          chan.dir = s.length + s.loopStart - 1;
                        } else {
                          chan.dir = 0;
                        }
                      }
                    }
                  } else chan.pointer = chan.index;

                  if (!chan.mute) {
                    if (!chan.dir) value = d[chan.pointer];
                      else value = d[chan.dir - chan.pointer];

                    chan.ldata = value * chan.lvol;
                    chan.rdata = value * chan.rvol;
                  } else {
                    chan.ldata = 0.0;
                    chan.rdata = 0.0;
                  }
                }
                chan.index = chan.pointer + chan.delta;

                if ((chan.fraction += chan.speed) >= 1.0) {
                  chan.index++;
                  chan.fraction--;
                }
                sample.l += chan.ldata;
                sample.r += chan.rdata;
                sample = sample.next;
              }
              chan = chan.next;
            }

            mixPos = mixLen;
            mixed += toMix;
            this.samplesLeft -= toMix;
          }

          sample = this.buffer[0];
          ldata = e.outputBuffer.getChannelData(0);
          rdata = e.outputBuffer.getChannelData(1);

          for (i = 0; i < size; ++i) {
            if (sample.l > 1.0) sample.l = 1.0;
              else if (sample.l < -1.0) sample.l = -1.0;

            if (sample.r > 1.0) sample.r = 1.0;
              else if (sample.r < -1.0) sample.r = -1.0;

            ldata[i] = sample.l;
            rdata[i] = sample.r;

            sample.l = sample.r = 0.0;
            sample = sample.next;
          }
      }},
      accurate: {
        value: function(e) {
          var chan, d1, d2, ldata, delta, i, mixed = 0, mixLen, mixPos = 0, mixValue, rdata, s1, s2, sample, size = this.bufferSize, toMix, value;

          if (this.completed) {
            if (!this.remains) {
              this.player.stop();
              return;
            }
            size = this.remains;
          }

          while (mixed < size) {
            if (!this.samplesLeft) {
              this.player.process();
              this.player.accurate();
              this.samplesLeft = this.samplesTick;

              if (this.completed) {
                size = mixed + this.samplesTick;

                if (size > this.bufferSize) {
                  this.remains = size - this.bufferSize;
                  size = this.bufferSize;
                }
              }
            }

            toMix = this.samplesLeft;
            if ((mixed + toMix) >= size) toMix = size - mixed;
            mixLen = mixPos + toMix;
            chan = this.channels[0];

            while (chan) {
              if (!chan.enabled) {
                chan = chan.next;
                continue;
              }

              s1 = chan.sample;
              d1 = s1.data;
              s2 = chan.oldSample;
              if (s2) d2 = s2.data;

              sample = this.buffer[mixPos];

              for (i = mixPos; i < mixLen; ++i) {
                value = chan.mute ? 0.0 : d1[chan.pointer];
                value += (d1[chan.pointer + chan.dir] - value) * chan.fraction;

                if ((chan.fraction += chan.speed) >= 1.0) {
                  delta = chan.fraction >> 0;
                  chan.fraction -= delta;

                  if (chan.dir > 0) {
                    chan.pointer += delta;

                    if (chan.pointer > chan.length) {
                      chan.fraction += chan.pointer - chan.length;
                      chan.pointer = chan.length;
                    }
                  } else {
                    chan.pointer -= delta;

                    if (chan.pointer < chan.length) {
                      chan.fraction += chan.length - chan.pointer;
                      chan.pointer = chan.length;
                    }
                  }
                }

                if (!chan.mixCounter) {
                  sample.l += value * chan.lvol;
                  sample.r += value * chan.rvol;

                  if (chan.volCounter) {
                    chan.lvol += chan.lvolDelta;
                    chan.rvol += chan.rvolDelta;
                    chan.volCounter--;
                  } else if (chan.panCounter) {
                    chan.lpan += chan.lpanDelta;
                    chan.rpan += chan.rpanDelta;
                    chan.panCounter--;

                    chan.lvol = chan.volume * chan.lpan;
                    chan.rvol = chan.volume * chan.rpan;
                  }
                } else {
                  if (s2) {
                    mixValue = chan.mute ? 0.0 : d2[chan.oldPointer];
                    mixValue += (d2[chan.oldPointer + chan.oldDir] - mixValue) * chan.oldFraction;

                    if ((chan.oldFraction += chan.oldSpeed) > 1) {
                      delta = chan.oldFraction >> 0;
                      chan.oldFraction -= delta;

                      if (chan.oldDir > 0) {
                        chan.oldPointer += delta;

                        if (chan.oldPointer > chan.oldLength) {
                          chan.oldFraction += chan.oldPointer - chan.oldLength;
                          chan.oldPointer = chan.oldLength;
                        }
                      } else {
                        chan.oldPointer -= delta;

                        if (chan.oldPointer < chan.oldLength) {
                          chan.oldFraction += chan.oldLength - chan.oldPointer;
                          chan.oldPointer = chan.oldLength;
                        }
                      }
                    }
                    sample.l += (value * chan.lmixRampU) + (mixValue * chan.lmixRampD);
                    sample.r += (value * chan.rmixRampU) + (mixValue * chan.rmixRampD);

                    chan.lmixRampD -= chan.lmixDeltaD;
                    chan.rmixRampD -= chan.rmixDeltaD;
                  } else {
                    sample.l += (value * chan.lmixRampU);
                    sample.r += (value * chan.rmixRampU);
                  }

                  chan.lmixRampU += chan.lmixDeltaU;
                  chan.rmixRampU += chan.rmixDeltaU;
                  chan.mixCounter--;

                  if (chan.oldPointer == chan.oldLength) {
                    if (!s2.loopMode) {
                      s2 = null;
                      chan.oldPointer = 0;
                    } else if (s2.loopMode == 1) {
                      chan.oldPointer = s2.loopStart;
                      chan.oldLength  = s2.length;
                    } else {
                      if (chan.oldDir > 0) {
                        chan.oldPointer = s2.length - 1;
                        chan.oldLength  = s2.loopStart;
                        chan.oldDir     = -1;
                      } else {
                        chan.oldFraction -= 1;
                        chan.oldPointer   = s2.loopStart;
                        chan.oldLength    = s2.length;
                        chan.oldDir       = 1;
                      }
                    }
                  }
                }

                if (chan.pointer == chan.length) {
                  if (!s1.loopMode) {
                    chan.enabled = 0;
                    break;
                  } else if (s1.loopMode == 1) {
                    chan.pointer = s1.loopStart;
                    chan.length  = s1.length;
                  } else {
                    if (chan.dir > 0) {
                      chan.pointer = s1.length - 1;
                      chan.length  = s1.loopStart;
                      chan.dir     = -1;
                    } else {
                      chan.fraction -= 1;
                      chan.pointer   = s1.loopStart;
                      chan.length    = s1.length;
                      chan.dir       = 1;
                    }
                  }
                }
                sample = sample.next;
              }
              chan = chan.next;
            }

            mixPos = mixLen;
            mixed += toMix;
            this.samplesLeft -= toMix;
          }

          sample = this.buffer[0];
          ldata = e.outputBuffer.getChannelData(0);
          rdata = e.outputBuffer.getChannelData(1);

          for (i = 0; i < size; ++i) {
            if (sample.l > 1.0) sample.l = 1.0;
              else if (sample.l < -1.0) sample.l = -1.0;

            if (sample.r > 1.0) sample.r = 1.0;
              else if (sample.r < -1.0) sample.r = -1.0;

            ldata[i] = sample.l;
            rdata[i] = sample.r;

            sample.l = sample.r = 0.0;
            sample = sample.next;
          }
      }}
    });

    o.bufferSize = 8192;
    return Object.seal(o);
  }
  function SBPlayer(mixer) {
    var o = CorePlayer();

    Object.defineProperties(o, {
      track   : { value:null, writable:true },
      length  : { value:0,    writable:true },
      restart : { value:0,    writable:true },
      timer   : { value:0,    writable:true },
      master  : { value:0,    writable:true },

      setup: {
        configurable:false,
        value: function() {
          this.mixer.setup(this.channels);
      }}
    });

    o.mixer = mixer || Soundblaster();
    o.mixer.player = o;

    o.endian  = 1;
    o.quality = 1;
    return o;
  }
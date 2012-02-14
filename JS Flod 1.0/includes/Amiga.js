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
  function AmigaChannel(idx) {
    var o = Object.create(null, {
      next    : { value:null, writable:true },
      mute    : { value:0,    writable:true },
      panning : { value:0.0,  writable:true },
      delay   : { value:0,    writable:true },
      pointer : { value:0,    writable:true },
      length  : { value:0,    writable:true },
      audena  : { value:0,    writable:true },
      audcnt  : { value:0,    writable:true },
      audloc  : { value:0,    writable:true },
      audper  : { value:0,    writable:true },
      audvol  : { value:0,    writable:true },
      timer   : { value:0.0,  writable:true },
      level   : { value:0.0,  writable:true },
      ldata   : { value:0.0,  writable:true },
      rdata   : { value:0.0,  writable:true },

      enabled: {
        get: function() { return this.audena; },
        set: function(value) {
          if (value == this.audena) return;

          this.audena = value;
          this.audloc = this.pointer;
          this.audcnt = this.pointer + this.length;

          this.timer = 1.0;
          if (value) this.delay += 2;
      }},
      period: {
        set: function(value) {
          if (value < 1 || value > 65535) value = 65535;
          this.audper = value;
      }},
      volume: {
        set: function(value) {
          if (value < 0) value = 0;
            else if (value > 64) value = 64;

          this.audvol = value;
      }},

      initialize: {
        value: function() {
          this.audena = 0;
          this.audcnt = 0;
          this.audloc = 0;
          this.audper = 50;
          this.audvol = 0;

          this.timer = 0.0;
          this.ldata = 0.0;
          this.rdata = 0.0;

          this.delay   = 0;
          this.pointer = 0;
          this.length  = 0;
      }},
      resetData: {
        value: function() {
          this.ldata = 0.0;
          this.rdata = 0.0;
      }}
    });

    o.panning = o.level = ((++idx & 2) == 0) ? -1.0 : 1.0;
    return Object.seal(o);
  }
  function AmigaFilter() {
    return Object.create(null, {
      active : { value: 0,  writable:true },
      forced : { value:-1,  writable:true },
      l0     : { value:0.0, writable:true },
      l1     : { value:0.0, writable:true },
      l2     : { value:0.0, writable:true },
      l3     : { value:0.0, writable:true },
      l4     : { value:0.0, writable:true },
      r0     : { value:0.0, writable:true },
      r1     : { value:0.0, writable:true },
      r2     : { value:0.0, writable:true },
      r3     : { value:0.0, writable:true },
      r4     : { value:0.0, writable:true },

      initialize: {
        value: function() {
          this.l0 = this.l1 = this.l2 = this.l3 = this.l4 = 0.0;
          this.r0 = this.r1 = this.r2 = this.r3 = this.r4 = 0.0;
      }},
      process: {
        value: function(model, sample) {
          var FL = 0.5213345843532200, P0 = 0.4860348337215757, P1 = 0.9314955486749749, d = 1.0 - P0;

          if (model == 0) {
            this.l0 = P0 * sample.l + d * this.l0;
            this.r0 = P0 * sample.r + d * this.r0;
            d = 1.0 - P1;
            sample.l = this.l1 = P1 * this.l0 + d * this.l1;
            sample.r = this.r1 = P1 * this.r0 + d * this.r1;
          }

          if ((this.active | this.forced) > 0) {
            d = 1.0 - FL;
            this.l2 = FL * sample.l + d * this.l2;
            this.r2 = FL * sample.r + d * this.r2;
            this.l3 = FL * this.l2 + d * this.l3;
            this.r3 = FL * this.r2 + d * this.r3;
            sample.l = this.l4 = FL * this.l3 + d * this.l4;
            sample.r = this.r4 = FL * this.r3 + d * this.r4;
          }

          if (sample.l > 1.0) sample.l = 1.0;
            else if (sample.l < -1.0) sample.l = -1.0;

          if (sample.r > 1.0) sample.r = 1.0;
            else if (sample.r < -1.0) sample.r = -1.0;
      }}
    });
  }
  function AmigaRow() {
    return Object.create(null, {
      note   : { value:0, writable:true },
      sample : { value:0, writable:true },
      effect : { value:0, writable:true },
      param  : { value:0, writable:true }
    });
  }
  function AmigaSample() {
    return Object.create(null, {
      name    : { value:"", writable:true },
      length  : { value:0,  writable:true },
      loop    : { value:0,  writable:true },
      repeat  : { value:0,  writable:true },
      volume  : { value:0,  writable:true },
      pointer : { value:0,  writable:true },
      loopPtr : { value:0,  writable:true }
    });
  }
  function AmigaStep() {
    return Object.create(null, {
      pattern   : { value:0, writable:true },
      transpose : { value:0, writable:true }
    });
  }
  function Amiga() {
    var o = CoreMixer();

    Object.defineProperties(o, {
      filter  : { value:null, writable:true },
      model   : { value:1,    writable:true },
      memory  : { value:[],   writable:true },
      loopPtr : { value:0,    writable:true },
      loopLen : { value:4,    writable:true },
      clock   : { value:0.0,  writable:true },
      master  : { value:0.0,  writable:true },
      ready   : { value:0,    writable:true },

      volume: {
        set: function(value) {
          if (value > 0) {
            if (value > 64) value = 64;
            this.master = (value / 64) * 0.00390625;
          } else {
            this.master = 0.0;
          }
      }},

      initialize: {
        value: function() {
          var i = this.memory.length, len = i + this.loopLen;
          this.reset();
          this.filter.initialize();

          if (!this.ready) {
            this.ready = 1;
            this.loopPtr = i;
            for (; i < len; ++i) this.memory[i] = 0.0;
          }
      }},
      restore: {
        value: function() {
          this.ready = 0;
          this.memory.length = 0;
      }},
      store: {
        value: function(stream, len, pointer) {
          var add, i, pos = stream.position, start = this.memory.length, total;
          if (pointer) stream.position = pointer;
          total = stream.position + len;

          if (total >= stream.length) {
            add = total - stream.length;
            len = stream.length - stream.position;
          }

          for (i = start, len += start; i < len; ++i)
            this.memory[i] = stream.readByte();

          for (len += add; i < len; ++i)
            this.memory[i] = 0.0;

          if (pointer) stream.position = pos;
          return start;
      }},
      fast: {
        value: function(e) {
          var chan, i, ldata, rdata, local = this.memory, lvol, mixed = 0, mixLen, mixPos = 0, rdata, rvol, sample, size = this.bufferSize, speed, toMix, value;

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
              sample = this.buffer[mixPos];

              if (chan.audena) {
                speed = chan.audper / this.clock;
                value = chan.audvol * this.master;
                lvol = value * (1 - chan.level);
                rvol = value * (1 + chan.level);

                for (i = mixPos; i < mixLen; ++i) {
                  if (chan.delay) {
                    chan.delay--;
                  } else if (--chan.timer < 1.0) {
                    if (!chan.mute) {
                      value = local[chan.audloc] * 0.0078125;
                      chan.ldata = value * lvol;
                      chan.rdata = value * rvol;
                    }

                    chan.audloc++;
                    chan.timer += speed;

                    if (chan.audloc >= chan.audcnt) {
                      chan.audloc = chan.pointer;
                      chan.audcnt = chan.pointer + chan.length;
                    }
                  }

                  sample.l += chan.ldata;
                  sample.r += chan.rdata;
                  sample = sample.next;
                }
              } else {
                for (i = mixPos; i < mixLen; ++i) {
                  sample.l += chan.ldata;
                  sample.r += chan.rdata;
                  sample = sample.next;
                }
              }
              chan = chan.next;
            }

            mixPos = mixLen;
            mixed += toMix;
            this.samplesLeft -= toMix;
          }

          value = this.model;
          local = this.filter;

          sample = this.buffer[0];
          ldata = e.outputBuffer.getChannelData(0);
          rdata = e.outputBuffer.getChannelData(1);

          for (i = 0; i < size; ++i) {
            local.process(value, sample);

            ldata[i] = sample.l;
            rdata[i] = sample.r;

            sample.l = sample.r = 0.0;
            sample = sample.next;
          }
      }}
    });

    o.channels[0] = AmigaChannel(0);
    o.channels[0].next = o.channels[1] = AmigaChannel(1);
    o.channels[1].next = o.channels[2] = AmigaChannel(2);
    o.channels[2].next = o.channels[3] = AmigaChannel(3);

    o.bufferSize = 8192;
    o.filter = AmigaFilter();
    o.master = 0.00390625;
    return Object.seal(o);
  }
  function AmigaPlayer(mixer) {
    var o = CorePlayer();

    Object.defineProperties(o, {
      quality: {
        set: function(value) {
          this.callback = this.mixer.fast.bind(this.mixer);
      }},
      stereo: {
        set: function(value) {
          var chan = this.mixer.channels[0];

          if (value < 0.0) value = 0.0;
            else if (value > 1.0) value = 1.0;

          while (chan) {
            chan.level = value * chan.panning;
            chan = chan.next;
          }
      }},
      volume: {
        set: function(value) {
          if (value < 0.0) value = 0.0;
            else if (value > 1.0) value = 1.0;

          this.mixer.master = value * 0.00390625;
      }},

      frequency: {
        value: function(value) {
          if (value) {
            this.mixer.clock = 3579545 / this.sampleRate;
            this.mixer.samplesTick = 735;
          } else {
            this.mixer.clock = 3546895 / this.sampleRate;
            this.mixer.samplesTick = 882;
          }
      }}
    });

    o.mixer = mixer || Amiga();
    o.mixer.player = o;
    o.frequency(0);

    o.channels = 4;
    o.endian   = 0;
    o.quality  = 0;
    o.speed    = 6;
    o.tempo    = 125;
    return o;
  }
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
  "use strict";
  window.neoart = Object.create(null);

  function ByteArray(stream, endian) {
    var o = Object.create(null, {
      endian : { value:1,    writable:true },
      length : { value:0,    writable:true },
      index  : { value:0,    writable:true },
      buffer : { value:null, writable:true },
      view   : { value:null, writable:true },

      bytesAvailable: {
        get: function() {
          return this.length - this.index;
      }},
      position: {
        get: function() { return this.index; },
        set: function(value) {
          if (value < 0) value = 0;
            else if (value > this.length) value = this.length;

          this.index = value;
      }},

      clear: {
        value: function() {
          this.buffer = new ArrayBuffer();
          this.view   = null;
          this.index  = this.length = 0;
      }},
      readAt: {
        value: function(index) {
          return this.view.getUint8(index);
      }},
      readByte: {
        value: function() {
          return this.view.getInt8(this.index++);
      }},
      readShort: {
        value: function() {
          var r = this.view.getInt16(this.index, this.endian);
          this.index += 2;
          return r;
      }},
      readInt: {
        value: function() {
          var r = this.view.getInt32(this.index, this.endian);
          this.index += 4;
          return r;
      }},
      readUbyte: {
        value: function() {
          return this.view.getUint8(this.index++);
      }},
      readUshort: {
        value: function() {
          var r = this.view.getUint16(this.index, this.endian);
          this.index += 2;
          return r;
      }},
      readUint: {
        value: function() {
          var r = this.view.getUint32(this.index, this.endian);
          this.index += 4;
          return r;
      }},
      readBytes: {
        value: function(buffer, offset, len) {
          var dst = buffer.view, i = this.index, src = this.view;
          if ((len += i) > this.length) len = this.length;

          for (; i < len; ++i)
            dst.setUint8(offset++, src.getUint8(i));

          this.index = i;
      }},
      readString: {
        value: function(len) {
          var i = this.index, src = this.view, text = "";
          if ((len += i) > this.length) len = this.length;

          for (; i < len; ++i)
            text += String.fromCharCode(src.getUint8(i));

          this.index = len;
          return text;
      }},
      writeAt: {
        value: function(index, value) {
          this.view.setUint8(index, value);
      }},
      writeByte: {
        value: function(value) {
          this.view.setInt8(this.index++, value);
      }},
      writeShort: {
        value: function(value) {
          this.view.setInt16(this.index, value);
          this.index += 2;
      }},
      writeInt: {
        value: function(value) {
          this.view.setInt32(this.index, value);
          this.index += 4;
      }}
    });

    o.buffer = stream;
    o.view   = new DataView(stream);
    o.length = stream.byteLength;

    return Object.seal(o);
  }

  function Sample() {
    return Object.create(null, {
      l    : { value:0.0,  writable:true },
      r    : { value:0.0,  writable:true },
      next : { value:null, writable:true }
    });
  }
  function CoreMixer() {
    return Object.create(null, {
      player      : { value:null, writable:true },
      channels    : { value:[],   writable:true },
      buffer      : { value:[],   writable:true },
      samplesTick : { value:0,    writable:true },
      samplesLeft : { value:0,    writable:true },
      remains     : { value:0,    writable:true },
      completed   : { value:0,    writable:true },

      bufferSize: {
        get: function() { return this.buffer.length; },
        set: function(value) {
          var i, len = this.buffer.length || 0;
          if (value == len || value < 512) return;
          this.buffer.length = value;

          if (value > len) {
            this.buffer[len] = Sample();

            for (i = ++len; i < value; ++i)
              this.buffer[i] = this.buffer[i - 1].next = Sample();
          }
      }},
      complete: {
        get: function() { return this.completed; },
        set: function(value) {
          this.completed = value ^ this.player.loopSong;
      }},

      reset: {
        value: function() {
          var chan = this.channels[0], sample = this.buffer[0];
          this.samplesLeft = 0;
          this.remains     = 0;
          this.completed   = 0;

          while (chan) {
            chan.initialize();
            chan = chan.next;
          }

          while (sample) {
            sample.l = sample.r = 0.0;
            sample = sample.next;
          }
      }},
      restore: {
        configurable:true,
        value: function() {}}
    });
  }
  function CorePlayer() {
    var o = Object.create(null, {
      context    : { value:null, writable:true },
      node       : { value:null, writable:true },
      analyse    : { value:0,    writable:true },
      endian     : { value:0,    writable:true },
      sampleRate : { value:0,    writable:true },
      playSong   : { value:0,    writable:true },
      lastSong   : { value:0,    writable:true },
      version    : { value:0,    writable:true },
      title      : { value:"",   writable:true },
      channels   : { value:0,    writable:true },
      loopSong   : { value:0,    writable:true },
      speed      : { value:0,    writable:true },
      tempo      : { value:0,    writable:true },
      mixer      : { value:null, writable:true },
      tick       : { value:0,    writable:true },
      paused     : { value:0,    writable:true },
      callback   : { value:null, writable:true },

      quality: {
        configurable:true,
        set: function(value) {
          this.callback = (value) ? this.mixer.accurate.bind(this.mixer) : this.mixer.fast.bind(this.mixer);
      }},

      toggle: {
        value: function(index) {
          this.mixer.channels[index].mute ^= 1;
      }},
      setup: {
        configurable:true,
        value: function() {}},
      load: {
        value: function(stream) {
          this.version  = 0;
          this.playSong = 0;
          this.lastSong = 0;

          this.mixer.restore();
          if (!stream.view) stream = ByteArray(stream);
          stream.position = 0;

          if (stream.readUint() == 67324752) {
            if (window.neoart.Unzip) {
              var zip = ZipFile(stream);
              stream = zip.uncompress(zip.entries[0]);
            } else {
              throw "Unzip support is not available.";
            }
          }

          stream.endian = this.endian;
          stream.position = 0;
          this.loader(stream);

          if (this.version) this.setup();
          return this.version;
      }},
      play: {
        value: function() {
          var e, node;
          if (!this.version) return;

          if (this.paused) {
            this.paused = 0;
          } else {
            this.initialize();
            this.node = this.context.createJavaScriptNode(this.mixer.bufferSize);
            this.node.onaudioprocess = this.callback;
          }

          if (this.analyse && window.neoart.Flectrum) {
            node = window.neoart.analyserNode = this.context.createAnalyser();
            this.node.connect(node);
            node.connect(this.context.destination);
          } else {
            this.node.connect(this.context.destination);
          }

          e = document.createEvent("Event");
          e.initEvent("flodPlay", true, false);
          document.dispatchEvent(e);
      }},
      pause: {
        value: function() {
          if (this.node) {
            this.node.disconnect();
            this.paused = 1;

            var e = document.createEvent("Event");
            e.initEvent("flodPause", true, false);
            document.dispatchEvent(e);
          }
      }},
      stop: {
        value: function() {
          if (this.node) {
            this.node.disconnect();
            this.node.onaudioprocess = this.node = null;
            this.paused = 0;
            if (this.restore) this.restore();

            var e = document.createEvent("Event");
            e.initEvent("flodStop", true, false);
            document.dispatchEvent(e);
          }
      }},
      reset: {
        value: function() {
          this.tick = 0;
          this.mixer.initialize();
          this.mixer.samplesTick = ((this.sampleRate * 2.5) / this.tempo) >> 0;
      }}
    });

    if (!window.neoart.audioContext)
      window.neoart.audioContext = new webkitAudioContext();

    o.context = window.neoart.audioContext;
    o.sampleRate = o.context.sampleRate;
    return o;
  }
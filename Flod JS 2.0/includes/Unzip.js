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
  function ZipFile(stream) {
    if (!stream) return null;

    var ERROR1  = "The archive is either in unknown format or damaged.",
        ERROR2  = "Unexpected end of archive.",
        ERROR3  = "Encrypted archive not supported.",
        ERROR4  = "Compression method not supported.",
        ERROR5  = "Invalid block type.",
        ERROR6  = "Available inflate data did not terminate.",
        ERROR7  = "Invalid literal/length or distance code.",
        ERROR8  = "Distance is too far back.",
        ERROR9  = "Stored block length did not match one's complement.",
        ERROR10 = "Too many length or distance codes.",
        ERROR11 = "Code lengths codes incomplete.",
        ERROR12 = "Repeat lengths with no first length.",
        ERROR13 = "Repeat more than specified lengths.",
        ERROR14 = "Invalid literal/length code lengths.",
        ERROR15 = "Invalid distance code lengths.",

        LENG  = [3,4,5,6,7,8,9,10,11,13,15,17,19,23,27,31,35,43,51,59,67,83,99,115,131,163,195,227,258],
        LEXT  = [0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0],
        DIST  = [1,2,3,4,5,7,9,13,17,25,33,49,65,97,129,193,257,385,513,769,1025,1537,2049,3073,4097,6145,8193,12289,16385,24577],
        DEXT  = [0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13],
        ORDER = [16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15];

    function Huffman(len) {
      var o = Object.create(null, {
        count  : { value:null, writable:true },
        symbol : { value:null, writable:true }
      });

      o.count  = new Uint16Array(len);
      o.symbol = new Uint16Array(len);
      return Object.seal(o);
    }

    function Inflater() {
      var o = Object.create(null, {
        output   : { value:null, writable:true },
        inpbuf   : { value:null, writable:true },
        inpcnt   : { value:0,    writable:true },
        outcnt   : { value:0,    writable:true },
        bitbuf   : { value:0,    writable:true },
        bitcnt   : { value:0,    writable:true },
        flencode : { value:null, writable:true },
        fdiscode : { value:null, writable:true },
        dlencode : { value:null, writable:true },
        ddiscode : { value:null, writable:true },

        input: {
          set: function(args) {
            this.inpbuf = args[0];
            this.inpbuf.endian = args[2];
            this.inpbuf.position = 0;
            this.inpcnt = 0;

            this.output = ByteArray(new ArrayBuffer(args[1]));
            this.output.endian = args[2];
            this.output.position = 0;
            this.outcnt = 0;
        }},

        inflate: {
          value: function() {
            var err, last, type;

            do {
              last = this.bits(1);
              type = this.bits(2);

              err = type == 0 ? this.stored() :
                    type == 1 ? this.codes(this.flencode, this.fdiscode) :
                    type == 2 ? this.dynamic() : 1;

              if (err) throw ERROR5;
            } while (!last);
        }},
        initialize: {
          value: function() {
            var len = new Uint8Array(288), sym = 0;
            this.flencode = Huffman(288);
            this.fdiscode = Huffman(30);

            for (; sym < 144; ++sym) len[sym] = 8;
            for (; sym < 256; ++sym) len[sym] = 9;
            for (; sym < 280; ++sym) len[sym] = 7;
            for (; sym < 288; ++sym) len[sym] = 8;
            this.construct(this.fdiscode, len, 288);

            for (sym = 0; sym < 30; ++sym) len[sym] = 5;
            this.construct(this.fdiscode, len, 30);

            this.dlencode = Huffman(286);
            this.ddiscode = Huffman(30);
        }},
        construct: {
          value: function(huff, arr, n) {
            var len = 0, left = 1, off = new Uint16Array(16), sym = 0;

            for (; len < 16; ++len) huff.count[len] = 0;
            for (; sym <  n; ++sym) huff.count[arr[sym]]++;
            if (huff.count[0] == n) return 0;

            for (len = 1; len < 16; ++len) {
              left <<= 1;
              left -= huff.count[len];
              if (left < 0) return left;
            }

            for (len = 1; len < 15; ++len)
              off[len + 1] = off[len] + huff.count[len];

            for (sym = 0; sym < n; ++sym)
              if (arr[sym] != 0) huff.symbol[off[arr[sym]]++] = sym;

            return left;
        }},
        bits: {
          value: function(need) {
            var buf = this.bitbuf, inplen = this.inpbuf.length;

            while (this.bitcnt < need) {
              if (this.inpcnt == inplen) throw ERROR6;
              buf |= this.inpbuf.readAt(this.inpcnt++) << this.bitcnt;
              this.bitcnt += 8;
            }

            this.bitbuf = buf >> need;
            this.bitcnt -= need;
            return buf & ((1 << need) - 1);
        }},
        codes: {
          value: function(lencode, discode) {
            var dis, len, pos, sym;

            do {
              sym = this.decode(lencode);
              if (sym < 0) return sym;

              if (sym < 256) {
                this.output.writeAt(this.outcnt++, sym);
              } else if (sym > 256) {
                sym -= 257;
                if (sym >= 29) throw ERRRO7;
                len = LENG[sym] + this.bits(LEXT[sym]);

                sym = this.decode(discode);
                if (sym < 0) return sym;
                dis = DIST[sym] + this.bits(DEXT[sym]);
                if (dis > this.outcnt) throw ERROR8;

                pos = this.outcnt - dis;
                while (len--) this.output.writeAt(this.outcnt++, this.output.readAt(pos++));
              }
            } while (sym != 256);

            return 0;
        }},
        decode: {
          value: function(huff) {
            var buf = this.bitbuf, code = 0, count, first = 0, index = 0, inplen = this.inpbuf.length, left = this.bitcnt, len = 1;

            while (1) {
              while (left--) {
                code |= buf & 1;
                buf >>= 1;
                count = huff.count[len];

                if (code < (first + count)) {
                  this.bitbuf = buf;
                  this.bitcnt = (this.bitcnt - len) & 7;
                  return huff.symbol[index + (code - first)];
                }

                index += count;
                first += count;
                first <<= 1;
                code  <<= 1;
                ++len;
              }

              left = 16 - len;
              if (!left) break;
              if (this.inpcnt == inplen) throw ERROR6;
              buf = this.inpbuf.readAt(this.inpcnt++);
              if (left > 8) left = 8;
            }

            return -9;
        }},
        stored: {
          value: function() {
            var inplen = this.inpbuf.length, len;
            this.bitbuf = this.bitcnt = 0;

            if ((this.inpcnt + 4) > inplen) throw ERROR6;
            len  = this.inpbuf.readAt(this.inpcnt++);
            len |= this.inpbuf.readAt(this.inpcnt++) << 8;

            if (this.inpbuf.readAt(this.inpcnt++) != ( ~len & 0xff) ||
                this.inpbuf.readAt(this.inpcnt++) != ((~len >> 8) & 0xff)) throw ERROR9;

            if ((this.inpcnt + len) > inplen) throw ERROR6;
            while (len--) this.output.writeAt(this.outcnt++, this.inpbuf.readAt(this.inpcnt++));
            return 0;
        }},
        dynamic: {
          value: function() {
            var arr = new Uint8Array(316), err, index = 0, len, nlen = this.bits(5) + 257, ndis = this.bits(5) + 1, ncode = this.bits(4) + 4, max = nlen + ndis, sym;

            if (nlen > 286 || ndis > 30) throw ERROR10;
            for (; index < ncode; ++index) arr[ORDER[index]] = this.bits(3);
            for (; index < 19; ++index) arr[ORDER[index]] = 0;

            err = this.construct(this.dlencode, arr, 19);
            if (err) throw ERROR11;
            index = 0;

            while (index < max) {
              sym = this.decode(this.dlencode);

              if (sym < 16) {
                arr[index++] = sym;
              } else {
                len = 0;

                if (sym == 16) {
                  if (index == 0) throw ERROR12;
                  len = arr[index - 1];
                  sym = 3 + this.bits(2);
                } else if (sym == 17) {
                  sym = 3 + this.bits(3);
                } else {
                  sym = 11 + this.bits(7);
                }

                if ((index + sym) > max) throw ERROR13;
                while (sym--) arr[index++] = len;
              }
            }

            err = this.construct(this.dlencode, arr, nlen);
            if (err < 0 || (err > 0 && nlen - this.dlencode.count[0] != 1)) throw ERROR14;

            err = this.construct(this.ddiscode, arr.subarray(nlen), ndis);
            if (err < 0 || (err > 0 && ndis - this.ddiscode.count[0] != 1)) throw ERROR15;

            return this.codes(this.dlencode, this.ddiscode);
        }}
      });

      o.initialize();
      return Object.seal(o);
    }

    function ZipEntry() {
      return Object.create(null, {
        name       : { value:"",   writable:true },
        extra      : { value:null, writable:true },
        version    : { value:0,    writable:true },
        flag       : { value:0,    writable:true },
        method     : { value:0,    writable:true },
        time       : { value:0,    writable:true },
        crc        : { value:0,    writable:true },
        compressed : { value:0,    writable:true },
        size       : { value:0,    writable:true },
        offset     : { value:0,    writable:true },

        date: {
          get: function() {
            return new Date(
              ((this.time >> 25) & 0x7f) + 1980,
              ((this.time >> 21) & 0x0f) - 1,
               (this.time >> 16) & 0x1f,
               (this.time >> 11) & 0x1f,
               (this.time >>  5) & 0x3f,
               (this.time & 0x1f) << 1
            );
        }},
        isDirectory: {
          get: function() {
            return (this.name.charAt(this.name.length - 1) == "/");
        }}
      });
    }

    var o = Object.create(null, {
      endian  : { value:1,    writable:true },
      entries : { value:null, writable:true },
      stream  : { value:null, writable:true },

      uncompress: {
        value: function(entry) {
          var src = this.stream, buffer, found = false, i, inflater, item, len, size;
          if (!entry) return null;

          if (typeof entry == "string") {
            len = this.entries.length;

            for (i = 0; i < len; ++i) {
              item = this.entries[i];

              if (item.name == entry) {
                entry = item;
                found = true;
                break;
              }
            }

            if (!found) return null;
          }

          src.position = entry.offset + 28;
          size = src.readUshort();
          src.position += (entry.name.length + size);

          if (entry.compressed) {
            buffer = ByteArray(new ArrayBuffer(entry.compressed), this.endian);
            src.readBytes(buffer, 0, entry.compressed);

            switch (entry.method) {
              case 0:
                return buffer;
                break;
              case 8:
                inflater = Inflater();
                inflater.input = [buffer, entry.size, this.endian];
                inflater.inflate();
                return inflater.output;
                break;
              default:
                throw ERROR4;
                break;
            }
          }
      }},
      parseCentral: {
        value: function() {
          var src = this.stream, entry, hdr = ByteArray(new ArrayBuffer(46), this.endian), i, len = this.entries.length, size;

          for (i = 0; i < len; ++i) {
            src.readBytes(hdr, 0, 46);
            hdr.position = 0;
            if (hdr.readUint() != 0x02014b50) throw ERROR2;
            hdr.position += 24;

            size = hdr.readUshort();
            if (!size) throw ERROR2;
            entry = ZipEntry();
            entry.name = src.readString(size);

            size = hdr.readUshort();
            if (size) {
              entry.extra = ByteArray(new ArrayBuffer(size), this.endian);
              src.readBytes(entry.extra, 0, size);
            }

            src.position += hdr.readUshort();
            hdr.position = 6;
            entry.version = hdr.readUshort();

            entry.flag = hdr.readUshort();
            if ((entry.flag & 1) == 1) throw ERROR3;

            entry.method     = hdr.readUshort();
            entry.time       = hdr.readUint();
            entry.crc        = hdr.readUint();
            entry.compressed = hdr.readUint();
            entry.size       = hdr.readUint();

            hdr.position = 42;
            entry.offset = hdr.readUint();
            Object.freeze(entry);
            this.entries[i] = entry;
          }
      }},
      parseEnd: {
        value: function() {
          var src = this.stream, i = src.length - 22, l = i - 65536;
          if (l < 0) l = 0;

          do {
            if (src.readAt(i) != 0x50) continue;
            src.position = i;
            if (src.readUint() == 0x06054b50) break;
          } while (--i > l);

          if (i == l) throw ERROR1;

          src.position = i + 10;
          this.entries = [];
          this.entries.length = src.readUshort();

          src.position = i + 16;
          src.position = src.readUint();
          this.parseCentral();
      }}
    });

    if (!stream.view) stream = ByteArray(stream);
    stream.endian = 1;
    stream.position = 0;

    o.stream = stream;
    o.parseEnd();
    return Object.seal(o);
  }

  window.neoart.Unzip = 1.0;
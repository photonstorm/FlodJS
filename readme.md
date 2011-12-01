JavaScript Flod 1.0
===================

This is a JavaScript port of my AS3 Flod library, it currently works only in Chrome (I've used version
17.0.942.0 to develop it), hopefully in the future other browsers will add support for the Web Audio API.

It took a lot of effort to reach this stage so if you want to use it in any commercial production I'll ask
you to mention the proper credits and to make a donation to: chreil@hotmail.com via PayPal, thank you.

This version will replay the following music formats using the Web Audio API:

* STPlayer (The Ultimate Soundtracker, DOC Soundtracker 9, Master Soundtracker, DOC Soundtracker 2.0)
* MKPlayer (Soundtracker 2.3, Soundtracker 2.5, NoiseTracker 1.0, NoiseTracker 1.1, NoiseTracker 2.0)
* HMPlayer (His Master's NoiseTracker)
* PTPlayer (ProTracker 1.0, ProTracker 1.1, ProTracker 1.2)
* FXPlayer (SoundFX 1.0, SoundFX 1.8, SoundFX 1.9, SoundFX 2.0)
* FCPlayer (FutureComposer 1.0, FutureComposer 1.2, FutureComposer 1.3, FutureComposer 1.4)
* S1Player (SidMon)
* S2Player (SidMon II)
* BPPlayer (BP SoundMon 1.0, BP SoundMon 2.0, BP SoundMon 3.0)
* D1Player (DeltaMusic 1.0)
* D2Player (DeltaMusic 2.0, Delta Music 2.2)
* DMPlayer (Digital Mugician 4 &amp; 7 Voices)
* DWPlayer (David Whittaker, this player is in beta and it doesn't support all the variants out there)
* F2Player (FastTracker II XM)

Author
------

2011/11/30/
Christian Corti
Neoart Costa Rica

E-Mail: flod@neoartcr.com

Example
-------

You can include just the player(s) you need in your page just remember that all the Amiga players needs
the Core.js and the Amiga.js files too and the PC player (FT2) needs the Core.js and the Soundblaster.js files.

Example, including the ProTracker player:
  Core.js
  Amiga.js
  PTPlayer.js

including the FastTracker II player:
  Core.js
  Soundblaster.js
  F2Player.js

License
-------

This work is licensed under the Creative Commons Attribution-Noncommercial-Share Alike 3.0 Unported License.
To view a copy of this license, visit http://creativecommons.org/licenses/by-nc-sa/3.0/ or send a letter to
Creative Commons, 171 Second Street, Suite 300, San Francisco, California, 94105, USA.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR
IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
<?php
header('Content-type: text/javascript');
echo <<<out
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
(function() {\n
out;
require_once 'minified/Core.js';
echo "\n\n";
require_once 'minified/Unzip.js';
echo "\n\n";
require_once 'minified/Amiga.js';
echo "\n\n";
require_once 'minified/Soundblaster.js';
echo "\n\n";
require_once 'minified/FileLoader.js';
echo "\n\n";
require_once 'minified/BPPlayer.js';
echo "\n\n";
require_once 'minified/D1Player.js';
echo "\n\n";
require_once 'minified/D2Player.js';
echo "\n\n";
require_once 'minified/DMPlayer.js';
echo "\n\n";
require_once 'minified/FCPlayer.js';
echo "\n\n";
require_once 'minified/FXPlayer.js';
echo "\n\n";
require_once 'minified/HMPlayer.js';
echo "\n\n";
require_once 'minified/MKPlayer.js';
echo "\n\n";
require_once 'minified/PTPlayer.js';
echo "\n\n";
require_once 'minified/S1Player.js';
echo "\n\n";
require_once 'minified/S2Player.js';
echo "\n\n";
require_once 'minified/STPlayer.js';
echo "\n\n";
require_once 'minified/F2Player.js';
echo "\n})()";
?>
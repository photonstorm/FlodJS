<?php
header('Content-type: text/javascript');
echo <<<out
/*
  Flod JS 2.0
  2012/04/01
  Christian Corti
  Neoart Costa Rica

  Last Update: Flod JS 2.0 - 2012/03/08

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
require_once 'includes/Core.js';
echo "\n\n";
require_once 'includes/Unzip.js';
echo "\n\n";
require_once 'includes/Amiga.js';
echo "\n\n";
require_once 'includes/Soundblaster.js';
echo "\n\n";
require_once 'includes/FileLoader.js';
echo "\n\n";
require_once 'includes/BPPlayer.js';
echo "\n\n";
require_once 'includes/D1Player.js';
echo "\n\n";
require_once 'includes/D2Player.js';
echo "\n\n";
require_once 'includes/DMPlayer.js';
echo "\n\n";
require_once 'includes/DWPlayer.js';
echo "\n\n";
require_once 'includes/FCPlayer.js';
echo "\n\n";
require_once 'includes/FEPlayer.js';
echo "\n\n";
require_once 'includes/FXPlayer.js';
echo "\n\n";
require_once 'includes/HMPlayer.js';
echo "\n\n";
require_once 'includes/JHPlayer.js';
echo "\n\n";
require_once 'includes/MKPlayer.js';
echo "\n\n";
require_once 'includes/PTPlayer.js';
echo "\n\n";
require_once 'includes/RHPlayer.js';
echo "\n\n";
require_once 'includes/S1Player.js';
echo "\n\n";
require_once 'includes/S2Player.js';
echo "\n\n";
require_once 'includes/STPlayer.js';
echo "\n\n";
require_once 'includes/F2Player.js';
echo "\n})()";
?>
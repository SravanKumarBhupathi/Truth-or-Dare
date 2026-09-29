// ensure globals are attached properly
if(typeof window !== 'undefined') {
    window.gameData = gameData;
    window.Storage = Storage;
    window.gameEngine = gameEngine;
    window.Animations = Animations;
    window.UI = UI;
    window.App = App;
}

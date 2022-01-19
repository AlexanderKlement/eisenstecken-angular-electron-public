const {ProgId, ShellOption, Regedit} = require('electron-regedit')

class regedit {

    constructor() {


        new ProgId({
            description: 'My App File',
            icon: 'myicon.ico',
            extensions: ['myapp'],
            shell: [
                new ShellOption({verb: ShellOption.OPEN}),
                new ShellOption({verb: ShellOption.EDIT, args: ['--edit']}),
                new ShellOption({verb: ShellOption.PRINT, args: ['--print']})
            ]
        })

        Regedit.installAll()
    }

}

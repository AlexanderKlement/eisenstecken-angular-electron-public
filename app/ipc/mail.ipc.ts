import { resolveMailExe } from "../paths";
import { ipcMain } from "electron";
import { LocalConfigMain } from "../LocalConfigMain";


export function registerMailIpc(): void {
  console.log("[mail.ipc] registerMailIpc() called"); // <-- add this

  const { mail32, mail64 } = resolveMailExe();
  console.log("[mail.ipc] resolved mail exe:", { mail32, mail64 }); // <-- add this

  ipcMain.on("send-mail-request", (event, arg) => {
    console.log("Preparing mail: " + LocalConfigMain.getInstance().getMailProcessor());

    /* let mailExecutablePath = mail32;
     if (LocalConfigMain.getInstance().getMailProcessor().includes("x64")) {
       mailExecutablePath = mail64;
     }

     let mailCommand = mailExecutablePath;
     for (const singleArg of arg) {
       mailCommand += " " + escapeShell(singleArg);
     }

     let cmd = "";
     if (process.platform === "win32") {
       cmd += "cmd /c chcp 65001>nul && ";
     }
     cmd += mailCommand;
 */
    const commands = [
      "$ProgressPreference = 'SilentlyContinue'",
      "$outlook = New-Object -ComObject Outlook.Application",
      "$mail = $outlook.CreateItem(0)",
      "$inspector = $mail.GetInspector",
      `$mail.To = '${arg[0]}'`,
      `$mail.Subject = '${arg[1]}'`,
      `$mail.HTMLBody = '${arg[2].replace(/\n/g, "<br>")}' + $mail.HTMLBody`
    ];
    if (arg.length > 3 && arg[3].length !== 0) {
      commands.push(`$mail.Attachments.Add('${arg[3]}') | Out-Null`);
      commands.push(`$mail.Display()`);
    } else {
      commands.push(`$mail.Display()`);
    }
    const script = commands.join(";");
    const encoded = Buffer.from(script, "utf16le").toString("base64");
    const cmd = `powershell -NoProfile -EncodedCommand ${encoded}`;
    console.log("[mail.ipc] exec cmd:", cmd);

    const childProcess = require("child_process");
    const child = childProcess.exec(cmd, (err: unknown, stdout: string, stderr: string): void => {
      const out = (stdout ?? "").trim();
      const errOut = (stderr ?? "").trim();
      let hasError = false;
      let errorString = "";
      if (err) {
        hasError = true;
        console.error("[mail.ipc] exec error:", err);
      }
      if (errOut.length > 0 && !errOut.startsWith("#< CLIXML")) {
        hasError = true;
        errorString = errOut;
        console.error("[mail.ipc] stderr:", errOut);
      } else if (errOut.startsWith("#< CLIXML")) {
        // extract <S S="Error">...</S> entries for readable messages
        const regex = /<S S="Error">(.*?)<\/S>/g;
        const matches: string[] = [];
        let m: RegExpExecArray | null;
        while ((m = regex.exec(errOut)) !== null) {
          matches.push(m[1].replace(/_x000D__x000A_/g, "\n"));
        }
        if (matches.length > 0) {
          hasError = true;
          errorString = matches.join("");
          console.error("[mail.ipc] ps error:", matches.join(""));
        }
      }
      if (out.length > 0) {
        console.log("[mail.ipc] stdout:", out);
      }

      // Decide success/failure based on actual process results
      if (!hasError) {
        event.reply("send-mail-reply", true);
        return;
      }


      event.reply("send-mail-reply", errorString);
    });

    child.on("error", (e: unknown) => {
      console.error("[mail.ipc] child process error event:", e);
      event.reply("send-mail-reply", "Mail process failed to start.");
    });
  });

  ipcMain.on("set-mail-processor-request", (event, arg) => {
    LocalConfigMain.getInstance().setMailProcessor(arg[0]);
    event.reply("set-mail-processor-replay", true);
  });

}

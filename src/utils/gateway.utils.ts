import { Purchase } from "../modules/purchases/purchase.model";
import fetch from "node-fetch";

function formatCommand (command, amount, username) {
  return command.replace(/\{username\}/g, username).replace(/\{amount\}/g, amount);
}

export async function sendPurchaseToGateway (purchase: Purchase) {
  const commands = {};

  for (const item of purchase.items) {
    const product = item["product"];

    for (const rawCommand of product.commands) {
      const serverName = rawCommand.split("|||")[0];
      const command = rawCommand.split("|||")[1];

      if (commands[serverName] == null) {
        commands[serverName] = [];
      }

      commands[serverName].push(formatCommand(command, item["amount"], purchase.buyer));
    }
  }

  const servers = Object.keys(commands);
  for (const server of servers) {
    const payload = commands[server].join("\n");
    await fetch(process.env.GATEWAY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'authorization': process.env.GATEWAY_SECRET },
      body: JSON.stringify({
        serverName: server,
        eventName: "runCommands",
        eventArg: payload
      })
    });
  }
}

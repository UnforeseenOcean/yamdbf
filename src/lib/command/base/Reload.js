'use babel';
'use strict';

import Command from '../Command';
import now from 'performance-now';

export default class Reload extends Command
{
	constructor(bot)
	{
		super(bot, {
			name: 'reload',
			description: 'Reload a command or all commands',
			aliases: ['r'],
			usage: '<prefix>reload [command]',
			extraHelp: `If a command name or alias is provided the specific command will be reloaded. Otherwise, all commands will be reloaded.`,
			group: 'base',
			ownerOnly: true
		});
	}

	async action(message, args, mentions) // eslint-disable-line no-unused-vars
	{
		let start = now();
		let command = this.bot.commands.findByNameOrAlias(args[0]);
		if (args[0] && !command)
		{
			message.channel.sendMessage(`Command "${args[0]}" could not be found.`)
				.then(response =>
				{
					response.delete(5 * 1000);
				});
			return;
		}
		if (command) this.bot.commandLoader.reloadCommand(command.name);
		else this.bot.commandLoader.loadCommands();
		let end = now();
		let name = args[0] ? this.bot.commands.findByNameOrAlias(args[0]).name : null;
		let text = name ? ` "${name}"` : 's';
		message.channel.sendMessage(`Command${text} reloaded. (${(end - start).toFixed(3)} ms)`)
			.then(response =>
			{
				response.delete(5 * 1000);
			});
	}
}

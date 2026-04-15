import { writeFile } from "node:fs/promises";
import { Session } from "node:inspector/promises";

export function cpuProfiling() {
	let _session: Session;

	return {
		async start() {
			_session = new Session();
			_session.connect();
			await _session.post("Profiler.enable");
			await _session.post("Profiler.start");
			console.log("CPU Profiling started");
		},
		async stop() {
			console.log("CPU Profiling stopped");
			const { profile } = await _session.post("Profiler.stop");
			const profileName = `cpf-profile-${Date.now()}.cpuprofile`;
			await writeFile(profileName, JSON.stringify(profile));
			console.log(`CPU Profile saved to ${profileName}`);
			await _session.disconnect();
		},
	};
}

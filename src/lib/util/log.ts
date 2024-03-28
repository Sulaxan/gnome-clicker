import type { TextComponent } from "$lib/protocol/text";
import { activityLog } from "$lib/stores";

export const LOG_ENTRY_MAX = 100;

/**
 * Logs some text to the activity log. The log is implicitly cleared if it goes above the max
 * allowed entries.
 *
 * @param components The components to log.
 */
export function log(components: TextComponent[]) {
    activityLog.update((log) => {
        log.push(components);

        // remove old entries
        if (log.length > LOG_ENTRY_MAX) {
            log.splice(0, log.length - LOG_ENTRY_MAX);
        }

        return log;
    });
}

/**
 * Logs some debug text to the activity log. The log is implicitly cleared if it goes above the max
 * allowed entries.
 *
 * @param components The components to debug log.
 */
export function debug(components: TextComponent[]) {
    // this isn't different from log, but we can do additional checking in here to see if we want to
    // log first
    log(components);
}

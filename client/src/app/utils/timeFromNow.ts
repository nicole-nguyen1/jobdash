import moment from "moment";

moment.updateLocale("en", {
	relativeTime: {
		future: "in %s",
		past: "%s",
		s: "%ds",
		ss: "%ds",
		m: "%dm",
		mm: "%dm",
		h: "%dh",
		hh: "%dh",
		d: "%dd",
		dd: "%dd",
		M: "%dmo",
		MM: "%dM",
		y: "%dy",
		yy: "%dY",
	},
});

export function timeFromNow(date: string): string {
	return moment(date).local().fromNow(true);
}

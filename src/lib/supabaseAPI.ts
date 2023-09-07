import type {SupabaseClient} from "@supabase/supabase-js";


export class SupabaseAPI {
	private supabase: SupabaseClient;

	private onError: (error: any) => void;

	constructor(supabase: SupabaseClient, onError: (error: any) => void) {
		this.supabase = supabase;
		this.onError = onError;
	}


}
package com.poizz.polybooking.data.remote

import com.poizz.polybooking.properties.SupabaseEnum
import io.github.jan.supabase.auth.Auth
import io.github.jan.supabase.createSupabaseClient
import io.github.jan.supabase.postgrest.Postgrest
import io.github.jan.supabase.realtime.Realtime
import io.github.jan.supabase.storage.Storage

object SupabaseClientInstance {
     val client = createSupabaseClient(
        supabaseUrl = SupabaseEnum.SUPABASE_URL.value,
        supabaseKey = SupabaseEnum.SUPABASE_PUBLIC_KEY.value
    ) {
        install(Auth)
        install(Postgrest)
        install(Realtime)
        install(Storage)
    }
}
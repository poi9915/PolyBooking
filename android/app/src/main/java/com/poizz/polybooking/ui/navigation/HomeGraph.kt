package com.poizz.polybooking.ui.navigation

import androidx.compose.material3.Button
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.navigation.NavHostController
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import com.poizz.polybooking.data.remote.SupabaseClientInstance
import com.poizz.polybooking.properties.HomeDestination
import io.github.jan.supabase.auth.auth
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch

@Composable
fun HomeGraph(
    supabase: SupabaseClientInstance,
    onLogout: () -> Unit,
    navController: NavHostController = rememberNavController(),
) {
    NavHost(navController = navController, startDestination = HomeDestination.MAIN)
    {
        composable(HomeDestination.MAIN) {
            // main screen vào đây
            DEMO(supabase , onLogout)
        }
    }
}

@Composable
fun DEMO(supabase: SupabaseClientInstance, onLogout: () -> Unit) {
    Button(
        onClick = {
            //supabase.client.auth.signOut()
            CoroutineScope(Dispatchers.Main).launch {
                supabase.client.auth.signOut()
                onLogout()

            }
        }
    ) {
        Text("Logout")
    }
}
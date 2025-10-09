package com.poizz.polybooking.ui.navigation

import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.navigation.NavHostController
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import io.github.jan.supabase.SupabaseClient

@Composable
fun HomeGraph(
    supabase: SupabaseClient,
    onLogout : () -> Unit,
    navController: NavHostController = rememberNavController()
 ) {
    NavHost(navController= navController , startDestination = HomeDestination.MAIN)
    {
        composable(HomeDestination.MAIN) {
            // main screen vào đây
        }
    }
}
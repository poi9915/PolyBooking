package com.poizz.polybooking.ui.navigation

import androidx.compose.runtime.Composable
import androidx.navigation.NavHostController
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import com.poizz.polybooking.ui.screen.auth.LoginScreen
import com.poizz.polybooking.ui.screen.auth.SignupScreen
import io.github.jan.supabase.SupabaseClient

@Composable
fun AuthGraph(
    supabase: SupabaseClient,
    onLoginSuccess: () -> Unit,
    navController: NavHostController = rememberNavController(),
) {
    NavHost(navController = navController, startDestination = AuthDestinations.LOGIN) {
        composable(AuthDestinations.LOGIN) {
            LoginScreen()
        }
        composable(AuthDestinations.SIGNUP) {
            SignupScreen()
        }
    }
}
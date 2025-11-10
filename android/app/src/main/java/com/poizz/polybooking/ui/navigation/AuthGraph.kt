package com.poizz.polybooking.ui.navigation

import androidx.compose.runtime.Composable
import androidx.navigation.NavHostController
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import com.poizz.polybooking.data.remote.SupabaseClientInstance
import com.poizz.polybooking.properties.AuthDestinations
import com.poizz.polybooking.ui.screen.auth.LoginScreen
import com.poizz.polybooking.ui.screen.auth.SignupScreen

@Composable
fun AuthGraph(
    supabase: SupabaseClientInstance,
    onLoginSuccess: () -> Unit,
    navController: NavHostController = rememberNavController(),
) {
    NavHost(navController = navController, startDestination = AuthDestinations.LOGIN) {
        composable(AuthDestinations.LOGIN) {
            LoginScreen(
                supabase = supabase,
                onLoginSuccess = onLoginSuccess,
                onNavigateToSignup = {
                    navController.navigate(AuthDestinations.SIGNUP)
            })
        }
        composable(AuthDestinations.SIGNUP) {
            SignupScreen(
                supabase = supabase,
                onSignupSuccess = onLoginSuccess,
                onNavigateBackToLogin = {
                    navController.navigate(AuthDestinations.LOGIN)
                }
            )
        }
    }
}
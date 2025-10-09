package com.poizz.polybooking.ui.screen

import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import com.poizz.polybooking.data.remote.SupabaseClient
import com.poizz.polybooking.ui.navigation.AuthGraph
import com.poizz.polybooking.ui.navigation.HomeGraph
import com.poizz.polybooking.ui.screen.component.LoadingScreen
import io.github.jan.supabase.auth.auth

sealed class AuthState {
    object Loading : AuthState()
    object UnAuthenticated : AuthState()
    object Authenticated : AuthState()
}

@Composable
fun MainApp(modifier: Modifier = Modifier) {
    val supabase = SupabaseClient.client
    var authState by remember { mutableStateOf<AuthState>(AuthState.Loading) }
    //Get supabase auth session
    LaunchedEffect(Unit) {
        authState = AuthState.Loading
        val session = supabase.auth.currentSessionOrNull()
        authState = if (session == null) AuthState.UnAuthenticated else AuthState.Authenticated
    }
    //Check trạng thái của session , nếu có thì cho vào main , ko thì bay về auth
    when (authState) {
        AuthState.Loading -> LoadingScreen()
        AuthState.UnAuthenticated -> AuthGraph(
            supabase = supabase,
            onLoginSuccess = { authState = AuthState.Authenticated }
        )

        AuthState.Authenticated -> HomeGraph(
            supabase = supabase,
            onLogout = { authState = AuthState.UnAuthenticated }
        )
    }
}
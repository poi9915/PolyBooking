package com.poizz.polybooking.data.remote

import androidx.compose.runtime.State
import androidx.compose.runtime.mutableStateOf
import io.github.jan.supabase.auth.auth
import io.github.jan.supabase.auth.status.SessionStatus
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch

object SessionManager {
    private val scope = CoroutineScope(Dispatchers.IO)
    private val _isLoading = mutableStateOf(true)
    val isLoading: State<Boolean> = _isLoading

    private val _currentUser = mutableStateOf<String?>(null)
    val currentUser: State<String?> = _currentUser

    fun observeSession() {
        val auth = SupabaseClient.client.auth

        scope.launch {
            // lấy session hiện tại khi khởi động app
            val session = auth.currentSessionOrNull()
            _currentUser.value = session?.user?.email
            _isLoading.value = false
            // check session realtime
            auth.sessionStatus.collect {
                when (it) {
                    is SessionStatus.NotAuthenticated -> {
                        _currentUser.value = null
                        _isLoading.value = false
                    }

                    is SessionStatus.Authenticated -> {
                        _currentUser.value = it.session.user?.email
                        _isLoading.value = false
                    }

                    SessionStatus.Initializing -> {
                        _isLoading.value = true
                    }

                    is SessionStatus.RefreshFailure -> {
                        _currentUser.value = null
                        _isLoading.value = false
                    }
                }
            }
        }
    }

    fun logout() {
        scope.launch {
            SupabaseClient.client.auth.signOut()
        }
    }
}
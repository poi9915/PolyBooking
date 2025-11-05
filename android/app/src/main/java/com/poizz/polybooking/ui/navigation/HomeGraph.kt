package com.poizz.polybooking.ui.navigation

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.navigation.NavHostController
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import com.poizz.polybooking.ui.screen.auth.AccountScreen
import com.poizz.polybooking.ui.screen.auth.BottomNavigationBar
import com.poizz.polybooking.ui.screen.auth.EditProfileScreen
import com.poizz.polybooking.ui.screen.auth.HomeScreen
import com.poizz.polybooking.ui.screen.auth.MenuScreen
import com.poizz.polybooking.ui.screen.auth.RuleScreen
import com.poizz.polybooking.ui.screen.auth.SettingScreen
import io.github.jan.supabase.SupabaseClient

@Composable
fun HomeGraph(
    supabase: SupabaseClient,
    onLogout : () -> Unit,
    navController: NavHostController = rememberNavController()
 ) {
    Scaffold(
        bottomBar = {
            BottomNavigationBar(navController)
        }
    ) { innerPadding ->
        NavHost(navController = navController, startDestination = HomeDestination.HOME,
            modifier = Modifier.padding(innerPadding))
        {
            composable(HomeDestination.HOME) {
                HomeScreen(navController)
            }
            composable(HomeDestination.MENU) {
                MenuScreen(
                    navController = navController,
                    onLogout = onLogout
                )
            }
            composable(HomeDestination.ACCOUNT) {
                AccountScreen(
                    onEditClick = {navController.navigate(HomeDestination.UPDATE_ACCOUNT)}
                )
            }
            composable(HomeDestination.SETTING) {
                SettingScreen()
            }
            composable(HomeDestination.UPDATE_ACCOUNT) {
                EditProfileScreen()
            }
            composable(HomeDestination.LUAT_DAU) {
                RuleScreen()
            }
            composable(HomeDestination.DAT_SAN) {
                RuleScreen()
            }
            composable(HomeDestination.GIAI_DAU) {
                RuleScreen()
            }
            composable(HomeDestination.TRINH_DO) {
                RuleScreen()
            }


        }
    }
}
@Composable
fun LogoutButton(onLogout: () -> Unit) {
    Button(
        onClick = { onLogout() },
        colors = ButtonDefaults.buttonColors(containerColor = Color.White),
        border = BorderStroke(1.dp, Color.Red),
        modifier = Modifier
            .fillMaxWidth()
            .padding(top = 8.dp)
    ) {
        Text("Đăng xuất", color = Color.Red, fontWeight = FontWeight.Bold)
    }
}

package com.poizz.polybooking.ui.screen.auth

import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Divider
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavController
import androidx.navigation.compose.rememberNavController
import com.poizz.polybooking.R
import com.poizz.polybooking.ui.navigation.HomeDestination
import com.poizz.polybooking.ui.navigation.LogoutButton

@Composable
fun MenuScreen(
    navController: NavController,
    onLogout: () -> Unit
) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(Color(0xFFDFFFC8))
    ) {
        HeadearSection()
        MenuSection(navController, onLogout)
    }
}

@Composable
fun MenuSection(navController: NavController, onLogout: () -> Unit) {
    Column(modifier = Modifier.padding(16.dp)) {
        MenuCategory(
            title = "Danh mục quản lý",
            items = listOf(
                MenuItem("Quản lý tài khoản", R.drawable.ic_setting_profile, HomeDestination.ACCOUNT),
                MenuItem("Lịch sử đặt sân", R.drawable.ic_lich_su_dat, HomeDestination.HOME)
            ),
            navController = navController
        )

        Spacer(Modifier.height(16.dp))

        MenuCategory(
            title = "Tiện ích ứng dụng",
            items = listOf(
                MenuItem("Cài đặt", R.drawable.ic_setting, HomeDestination.SETTING),
                MenuItem("Phản hồi ứng dụng", R.drawable.ic_phan_hoi, ""),
                MenuItem("Giới thiệu", R.drawable.ic_gioi_thieu, "")
            ),
            navController = navController
        )

        Spacer(Modifier.height(16.dp))

        MenuCategory(
            title = "Chính sách và hỗ trợ",
            items = listOf(
                MenuItem("Điều khoản và dịch vụ", R.drawable.ic_file, ""),
                MenuItem("Chính sách bảo mật", R.drawable.ic_password, "")
            ),
            navController = navController
        )

        Spacer(Modifier.height(24.dp))

        // ✅ Truyền onLogout vào đây
        LogoutButton(onLogout = onLogout)
    }
}

data class MenuItem(val title: String, val iconRes: Int, val route: String)

@Composable
fun MenuCategory(title: String, items: List<MenuItem>, navController: NavController) {
    Column {
        Text(title, fontWeight = FontWeight.Bold, fontSize = 16.sp)
        Spacer(Modifier.height(8.dp))
        Column(
            modifier = Modifier
                .background(Color.White, RoundedCornerShape(8.dp))
                .padding(8.dp)
        ) {
            items.forEachIndexed { index, item ->
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clickable {
                            if (item.route.isNotEmpty()) {
                                navController.navigate(item.route)
                            }
                        }
                        .padding(vertical = 10.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Image(
                        painter = painterResource(id = item.iconRes),
                        contentDescription = item.title,
                        modifier = Modifier.size(24.dp)
                    )
                    Spacer(Modifier.width(12.dp))
                    Text(item.title, fontSize = 15.sp)
                }
                if (index != items.lastIndex)
                    Divider(color = Color.LightGray, thickness = 1.dp)
            }
        }
    }
}



@Preview(showBackground = true)
@Composable
fun MenuScreenPreview() {
    MenuScreen(
        rememberNavController(),
        onLogout = TODO()
    )
}

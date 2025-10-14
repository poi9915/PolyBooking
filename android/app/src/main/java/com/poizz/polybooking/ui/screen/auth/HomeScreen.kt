package com.poizz.polybooking.ui.screen.auth

import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.NotificationsActive
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.ElevatedCard
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.NavigationBar
import androidx.compose.material3.NavigationBarItem
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.google.android.material.bottomnavigation.BottomNavigationView
import com.poizz.polybooking.ui.theme.PolyBookingTheme
import com.poizz.polybooking.R

@Composable
fun HomeScreen() {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(Color(0xFFDFFFC8)) // nền xanh lá nhạt
    ) {
        // Header
        HeadearSection()

        // Tính năng Pickleball
        FeatureSection()

        // Tin tức & sự kiện
        NewsSection()

        Spacer(modifier = Modifier.weight(1f))

        // Thanh menu cuối
        BottomNavigationBar()
    }
}

@Composable
fun HeadearSection() {
    Box(
        modifier = Modifier
            .fillMaxWidth()
            .height(200.dp)
    ) {
        // 🖼 Ảnh nền (background)
        Image(
            painter = painterResource(id = R.drawable.img_1), // 👉 ảnh nền bạn thêm vào res/drawable/
            contentDescription = "Header Background",
            modifier = Modifier
                .fillMaxSize()
                .clip(
                    RoundedCornerShape(
                        bottomStart = 20.dp,
                        bottomEnd = 20.dp
                    )
                ),
            contentScale = ContentScale.Crop
        )

        // 🌟 Nội dung chồng lên ảnh
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(16.dp),
            verticalArrangement = Arrangement.SpaceBetween
        ) {
            // Hàng đầu: logo + chuông
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Image(
                    painter = painterResource(id = R.drawable.logo_polybooking_notext),
                    contentDescription = "Logo",
                    modifier = Modifier
                        .size(70.dp)
                        .clip(CircleShape)
                )

                Image(
                    painter = painterResource(id = R.drawable.polybooking_desgin),
                    contentDescription = "Logo",
                    modifier = Modifier
                        .width(200.dp)


                )

                IconButton(onClick = { /* TODO: notification */ }) {
                    Icon(
                        Icons.Default.NotificationsActive,
                        contentDescription = "Thông báo",
                        tint = Color.White
                    )
                }
            }

            // Thông tin người dùng (Card mờ nằm chồng lên ảnh)
            Card(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(top = 12.dp),
                shape = RoundedCornerShape(
                    bottomStart = 20.dp,
                    bottomEnd = 20.dp
                ),
                colors = CardDefaults.cardColors(containerColor = Color.White.copy(alpha = 0.9f)), // hơi mờ để thấy nền
                elevation = CardDefaults.cardElevation(defaultElevation = 6.dp)
            ) {
                Row(
                    modifier = Modifier
                        .padding(16.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    // Avatar
                    Image(
                        painter = painterResource(id = R.drawable.outline_person_24),
                        contentDescription = "Avatar",
                        modifier = Modifier
                            .size(55.dp)
                            .clip(CircleShape)
                            .background(Color.LightGray)
                    )

                    Spacer(modifier = Modifier.width(16.dp))

                    // Tên & ID
                    Column {
                        Text(
                            text = "Tên người dùng",
                            fontWeight = FontWeight.Bold,
                            fontSize = 16.sp,
                            color = Color.Black
                        )
                        Text(
                            text = "ID: 12345",
                            fontSize = 13.sp,
                            color = Color.DarkGray
                        )
                    }
                }
            }
        }
    }
}



@Composable
fun UserInfoSection() {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .background(Color(0xFFFFFFFF))
            .padding(16.dp)
            .clip(RoundedCornerShape(
                topStart = 10.dp,
                topEnd = 10.dp,
            )),
        verticalAlignment = Alignment.CenterVertically
    ) {
        Surface(
            shape = CircleShape,
            color = Color.LightGray,
            modifier = Modifier.size(60.dp)
        ) {}

        Spacer(modifier = Modifier.width(16.dp))

        Column {
            Text("Tên người dùng", fontWeight = FontWeight.Bold, color = Color.Black)
            Text("ID: 12345", color = Color.DarkGray)
        }
    }
}

@Composable
fun FeatureSection() {
    Column(
        modifier = Modifier
            .padding(12.dp)
            .background(Color.White, RoundedCornerShape(12.dp))
            .padding(12.dp)
    ) {
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween
        ) {
            Text("Tính năng Pickleball", fontWeight = FontWeight.Bold, fontSize = 18.sp)
        }
        Spacer(Modifier.height(8.dp))

        Row(
            horizontalArrangement = Arrangement.SpaceBetween,
            modifier = Modifier.fillMaxWidth()
        ) {
            FeatureItem("Đặt sân", R.drawable.icon_san_pickleball)
            FeatureItem("Giải đấu", R.drawable.icon_cup)
            FeatureItem("Trình độ", R.drawable.icon_trinh_do)
            FeatureItem("Luật", R.drawable.img)
        }
    }
}


@Composable
fun FeatureItem(title: String, iconRes: Int) {
    Column(
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        // Dùng Image thay vì Icon để giữ nguyên màu ảnh gốc
        Image(
            painter = painterResource(id = iconRes),
            contentDescription = title,
            modifier = Modifier.size(40.dp),
            contentScale = ContentScale.Fit
        )

        Spacer(Modifier.height(4.dp))
        Text(title, fontSize = 12.sp, color = Color.Black)
    }
}

@Composable
fun NewsSection() {
    Column(modifier = Modifier.padding(16.dp)) {
        Text("Tin tức & sự kiện nổi bật", fontWeight = FontWeight.Bold, fontSize = 18.sp)
        Spacer(Modifier.height(12.dp))

        EventCard("New Sports", "38 Bích Câu", "06:00 - 22:30", R.drawable.outline_event_24)
        Spacer(Modifier.height(12.dp))
        EventCard("3CE", "Tân Đức Thắng", "05:00 - 24:00", R.drawable.outline_event_24)
    }
}


@Composable
fun EventCard(title: String, address: String, time: String, imageRes: Int) {
    ElevatedCard(modifier = Modifier.fillMaxWidth()) {
        Row(modifier = Modifier.padding(12.dp), verticalAlignment = Alignment.CenterVertically) {
            Image(
                painter = painterResource(id = imageRes),
                contentDescription = null,
                modifier = Modifier.size(60.dp),
                contentScale = ContentScale.Crop
            )
            Spacer(Modifier.width(16.dp))
            Column(modifier = Modifier.weight(1f)) {
                Text(title, fontWeight = FontWeight.Bold)
                Text(address, fontSize = 12.sp)
                Text(time, fontSize = 12.sp)
            }
            Button(
                onClick = {},
                colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF8BC34A))
            ) {
                Text("ĐẶT LỊCH", color = Color.White)
            }
        }
    }
}
@Composable
fun BottomNavigationBar() {
    NavigationBar(containerColor = Color.White) {
        NavigationBarItem(
            selected = true,
            onClick = {},
            icon = { Icon(painterResource(R.drawable.baseline_home_24), contentDescription = "Trang chủ") },
            label = { Text("Trang chủ") }
        )
        NavigationBarItem(
            selected = false,
            onClick = {},
            icon = { Icon(painterResource(R.drawable.outline_leaderboard_24), contentDescription = "BXH") },
            label = { Text("Bảng xếp hạng") }
        )
        NavigationBarItem(
            selected = false,
            onClick = {},
            icon = { Icon(painterResource(R.drawable.outline_menu_24), contentDescription = "Menu") },
            label = { Text("Menu") }
        )
    }
}




@Preview(showBackground = true)
@Composable
fun PreviewHomeScreen() {
    PolyBookingTheme {
        HomeScreen()
    }
}
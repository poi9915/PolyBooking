package com.poizz.polybooking.ui.screen.auth

import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material.icons.filled.Home
import androidx.compose.material.icons.filled.Notifications
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.poizz.polybooking.R

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun BangXepHangScreen(
    modifier: Modifier = Modifier,
    onBackClick: () -> Unit = {}
) {
    val players = remember {
        listOf(
            "Đỗ Đức Anh",
            "Hồ Văn Dương",
            "Hoàng Văn Điêu",
            "Phan Công Vinh",
            "Văn Thắng",
            "Văn Duy",
            "Nghiêm Hòa"
        )
    }

    Column(
        modifier = modifier
            .fillMaxSize()
            .background(Color(0xFFF4F4F4))
    ) {
        // 🔹 Header
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .background(Color(0xFF4CAF50))
                .padding(vertical = 14.dp, horizontal = 12.dp),
        ) {
            IconButton(
                onClick = onBackClick,
                modifier = Modifier.align(Alignment.CenterStart)
            ) {
                Icon(
                    imageVector = Icons.Default.ArrowBack,
                    contentDescription = "Quay lại",
                    tint = Color.White
                )
            }

            Text(
                text = "BẢNG XẾP HẠNG",
                color = Color.White,
                fontSize = 18.sp,
                fontWeight = FontWeight.Bold,
                modifier = Modifier.align(Alignment.Center)
            )

            IconButton(
                onClick = { /* thông báo */ },
                modifier = Modifier.align(Alignment.CenterEnd)
            ) {
                Icon(
                    imageVector = Icons.Default.Notifications,
                    contentDescription = "Thông báo",
                    tint = Color.White
                )
            }
        }

        Spacer(modifier = Modifier.height(8.dp))

        // 📋 Danh sách người chơi
        LazyColumn(
            modifier = Modifier
                .weight(1f)
                .padding(horizontal = 12.dp),
            verticalArrangement = Arrangement.spacedBy(10.dp)
        ) {
            items(players) { name ->
                PlayerItem(name = name)
            }
        }

        // 🔸 Thanh điều hướng dưới cùng
        BottomNavigationBar()
    }
}

@Composable
fun PlayerItem(name: String) {
    Card(
        modifier = Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(12.dp)),
        colors = CardDefaults.cardColors(containerColor = Color.White),
        elevation = CardDefaults.cardElevation(4.dp)
    ) {
        Row(
            modifier = Modifier
                .padding(horizontal = 12.dp, vertical = 10.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            // Ảnh đại diện (icon mặc định)
            Image(
                painter = painterResource(id = R.drawable.ic_launcher_foreground),
                contentDescription = "Avatar",
                modifier = Modifier
                    .size(40.dp)
                    .clip(CircleShape)
                    .background(Color(0xFFE0F2F1)),
                contentScale = ContentScale.Crop
            )

            Spacer(modifier = Modifier.width(12.dp))

            Column(modifier = Modifier.weight(1f)) {
                Text(
                    text = name,
                    color = Color(0xFF222222),
                    fontSize = 16.sp,
                    fontWeight = FontWeight.Medium
                )
                Text(
                    text = "Unscored",
                    color = Color.Gray,
                    fontSize = 13.sp
                )
            }

            Text(
                text = "N/A",
                color = Color(0xFF009688),
                fontSize = 14.sp,
                fontWeight = FontWeight.Bold,
                textAlign = TextAlign.End
            )
        }
    }
}

@Composable
fun BottomNavigationBar() {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .background(Color.White)
            .padding(vertical = 8.dp),
        horizontalArrangement = Arrangement.SpaceEvenly,
        verticalAlignment = Alignment.CenterVertically
    ) {
        IconButton(onClick = { /* Home */ }) {
            Icon(Icons.Default.Home, contentDescription = "Trang chủ", tint = Color(0xFF070707))
        }
        IconButton(onClick = { /* Rank */ }) {
            Icon(
                painter = painterResource(id = R.drawable.ic_launcher_foreground),
                contentDescription = "Xếp hạng",
                tint = Color(0xFF2196F3)
            )
        }
        IconButton(onClick = { /* Profile */ }) {
            Icon(
                painter = painterResource(id = R.drawable.ic_launcher_foreground),
                contentDescription = "Tài khoản",
                tint = Color(0xFF070707)
            )
        }
    }
}

@Preview(showBackground = true)
@Composable
fun PreviewBangXepHangScreen() {
    BangXepHangScreen()
}
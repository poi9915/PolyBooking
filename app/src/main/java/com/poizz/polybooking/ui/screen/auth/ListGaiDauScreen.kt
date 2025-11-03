package com.poizz.polybooking.ui.screen.auth

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material.icons.filled.Search
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

// 🎨 Màu sắc
private val HeaderGreen = Color(0xFF4CAF50)
private val LightGreen = Color(0xFFE9FAE9)
private val TextDark = Color(0xFF222222)

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun GiaiDauScreen(
    modifier: Modifier = Modifier,
    onBackClick: () -> Unit = {}
) {
    var searchText by remember { mutableStateOf("") }

    Column(
        modifier = modifier
            .fillMaxSize()
            .background(Color.White)
    ) {
        // 🔹 Thanh tiêu đề
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .background(HeaderGreen)
                .padding(vertical = 14.dp, horizontal = 12.dp),
        ) {
            // Nút quay lại (trái)
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

            // Tiêu đề (giữa)
            Text(
                text = "Giải đấu",
                color = Color.White,
                fontSize = 18.sp,
                fontWeight = FontWeight.Bold,
                modifier = Modifier.align(Alignment.Center)
            )
        }


        Spacer(modifier = Modifier.height(10.dp))

        // 🔍 Ô tìm kiếm
        OutlinedTextField(
            value = searchText,
            onValueChange = { searchText = it },
            placeholder = {
                Text(
                    text = "Tìm kiếm",
                    color = Color.Gray,
                    fontSize = 14.sp
                )
            },
            singleLine = true,
            shape = RoundedCornerShape(50),
            trailingIcon = {
                Icon(
                    imageVector = Icons.Default.Search,
                    contentDescription = "Tìm kiếm",
                    tint = Color.Gray
                )
            },
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 16.dp)
                .height(52.dp),
            colors = OutlinedTextFieldDefaults.colors(
                focusedBorderColor = HeaderGreen,
                unfocusedBorderColor = Color.LightGray
            )
        )

        Spacer(modifier = Modifier.height(10.dp))

        // 📜 Danh sách giải đấu
        val list = listOf("Giải A", "Giải B", "Giải C")

        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .padding(horizontal = 16.dp),
            verticalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            items(list) { item ->
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clip(RoundedCornerShape(20.dp))
                        .background(LightGreen)
                        .padding(vertical = 30.dp),
                    contentAlignment = Alignment.Center
                ) {
                    Text(
                        text = item,
                        color = TextDark,
                        fontSize = 16.sp,
                        fontWeight = FontWeight.Medium,
                        textAlign = TextAlign.Center
                    )
                }
            }
        }
    }
}

@Preview(showBackground = true)
@Composable
fun PreviewListGiaiDauScreen() {
    GiaiDauScreen()
}

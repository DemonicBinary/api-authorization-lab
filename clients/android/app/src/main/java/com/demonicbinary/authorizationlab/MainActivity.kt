package com.demonicbinary.authorizationlab

import android.app.Activity
import android.os.Bundle
import android.view.ViewGroup
import android.widget.ArrayAdapter
import android.widget.Button
import android.widget.LinearLayout
import android.widget.ScrollView
import android.widget.Spinner
import android.widget.TextView
import java.net.HttpURLConnection
import java.net.URL
import kotlin.concurrent.thread

// Debug-only educational app for Android Emulator, not Play Store software.
// 10.0.2.2 is the Emulator's alias to the developer machine's loopback.
class MainActivity : Activity() {
    private fun selector(options: List<String>) = Spinner(this).apply {
        adapter = ArrayAdapter(this@MainActivity, android.R.layout.simple_spinner_dropdown_item, options)
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        val layout = LinearLayout(this).apply {
            orientation = LinearLayout.VERTICAL
            setPadding(32, 32, 32, 32)
        }
        val identity = selector(listOf("alice", "bob", "admin", "none"))
        val document = selector(listOf("doc-101", "doc-202", "doc-103"))
        val handler = selector(listOf("guarded", "vulnerable"))
        val response = TextView(this).apply {
            text = "Run npm start on your Mac, then try a synthetic request."
            textSize = 15f
            setPadding(0, 28, 0, 0)
        }
        val button = Button(this).apply { text = "Run local request" }
        listOf(
            TextView(this).apply { text = "Authorization Lab · synthetic API boundary"; textSize = 22f },
            TextView(this).apply { text = "Identity does not grant object permission. Never reuse demo credentials or expose the vulnerable endpoint." },
            identity, document, handler, button, response
        ).forEach { child ->
            layout.addView(child, LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT))
        }
        val scroll = ScrollView(this).apply { addView(layout) }
        setContentView(scroll)
        button.setOnClickListener {
            val user = identity.selectedItem.toString()
            val doc = document.selectedItem.toString()
            val mode = handler.selectedItem.toString()
            button.isEnabled = false
            response.text = "Requesting local server…"
            thread {
                var connection: HttpURLConnection? = null
                val text = try {
                    val url = URL("http://10.0.2.2:8765/$mode/documents/$doc")
                    connection = url.openConnection() as HttpURLConnection
                    connection!!.requestMethod = "GET"
                    connection!!.connectTimeout = 4000
                    connection!!.readTimeout = 4000
                    if (user != "none") connection!!.setRequestProperty("Authorization", "Bearer demo-$user")
                    val status = connection!!.responseCode
                    val stream = if (status in 200..299) connection!!.inputStream else connection!!.errorStream
                    "HTTP $status\n\n" + (stream?.bufferedReader()?.use { it.readText() } ?: "(empty response)")
                } catch (error: Exception) {
                    "Local request failed: ${error.message}\nRun npm start first."
                } finally {
                    connection?.disconnect()
                }
                runOnUiThread {
                    response.text = text
                    button.isEnabled = true
                }
            }
        }
    }
}

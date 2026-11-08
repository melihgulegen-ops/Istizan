# İstizan — Çevrimdışı Telefon Uygulaması

melihgulegen-ops/elih deposunda görülen görev, istizan ve not işlevleri React Native, Expo ve Expo Router ile telefon uygulamasına uyarlanmıştır. Orijinal web kodu veya Capacitor kullanılmaz. İmza: Melih Gülegen · MGN.

## Özellikler

- Genel bakiye, geçen aydan devreden tutar ve bu ayın bakiyesi.
- Görev ekleme, düzenleme, silme, tarih/saat, öncelik, plan ve tamamlanma durumu.
- Yatan, iade ve alınan malzeme kayıtları; kişi, tutar, malzeme, yer ve miktar alanları.
- Not ekleme, düzenleme, silme, arama ve ay filtresi.
- Cihazda PDF ve gerçek XLSX raporları oluşturma.
- Kalıcı yerel AsyncStorage saklama. İlk kurulumda kayıtlar boştur; örnek veya sahte veri yoktur.

Yatan ve iade tutarları bakiyeye eklenir, malzeme tutarları bakiyeden düşülür. Devreden bakiye mevcut aydan önceki kayıtların net toplamıdır. Rapor dönemi kayıtları filtreler; rapordaki genel bakiye tüm kayıtları kapsar.

## İnternetsiz kullanım

Kurulmuş Android uygulaması açılmak, kayıt saklamak ve rapor oluşturmak için internet, giriş veya sunucu gerektirmez. Uzaktan görsel, yazı tipi veya veri indirmez. OTA güncellemeleri kapalıdır. OnSpace önizlemesi ve uygulamayı derleme/indirme işlemleri internet gerektirir. Paylaşımda internet gerektiren bir uygulama seçilirse o uygulamanın bağlantı gereksinimi ayrıdır.

Veriler yalnızca uygulamanın cihazdaki alanında saklanır. Uygulamayı kaldırmak, uygulama verilerini temizlemek veya önizlemenin tarayıcı verilerini temizlemek kayıtları silebilir. Önizleme ve APK birbirinden ayrı depolama kullanır. PDF/Excel raporları otomatik geri yüklenebilir yedekler değildir.

## GitHub üzerinden Android APK

`.github/workflows/android-release.yml` Expo/React Native uygulamasını GitHub Actions üzerinde derler. Klasörün adı tam olarak `workflows` olmalıdır; sonunda boşluk bulunmamalıdır. Eski Capacitor/web derleme iş akışı kullanılmaz.

Bu oturumda GitHub'a commit/push gönderilmedi ve APK derlenmedi. Bu projenin güncel kaynak kodu GitHub reposuna aktarıldıktan sonra derleme yapılabilir. Yalnızca iş akışını eski web reposuna eklemek yeterli değildir; Expo uygulamasının kaynakları ve bağımlılıkları da aynı repoda bulunmalıdır.

1. Güncel projeyi OnSpace **GitHub** menüsünden repoya aktarın veya **Download → Source Code** ile indirip kaynak dosyalarını reponun kök dizinine yükleyin. `package.json`, `app.json`, `app.config.ts`, `app/`, `components/`, `services/`, `hooks/`, `contexts/`, `constants/` ve `template/` dosyalarını koruyun.
2. [Istizan Actions](https://github.com/melihgulegen-ops/Istizan/actions) ekranını açın.
3. **Android APK Release → Run workflow → Run workflow** seçin. `main` veya `master` dalına kod gönderildiğinde de otomatik çalışır.
4. İşlem yeşil olduğunda işlem sayfasının altındaki **Artifacts → istizan-offline-apk** dosyasını indirin. İndirmek için GitHub hesabınıza giriş yapmanız gerekir. İşlem özetinde de indirme bağlantısı gösterilir.
5. ZIP'i çıkarın, içindeki **istizan-offline.apk** dosyasını Android telefona kurun. Gerektiğinde bu kaynaktan uygulama yükleme iznini açın. Expo Go veya bilgisayarda çalışan bir geliştirme sunucusu gerekmez.

Node.js, Java ve Android SDK iş akışında hazırlanır. Expo hesabı, `EXPO_TOKEN` veya ücretli EAS derlemesi gerekmez. `expo prebuild` ile Android projesi oluşturulur ve `assembleRelease` ile JavaScript paketi APK içine gömülür. İş akışı bu paketin APK'da bulunduğunu kontrol eder; uçak modu ve cihaz testleri ayrıca yapılmalıdır.

APK kişisel kullanım için Expo şablonunun **geliştirme imzalama anahtarıyla** imzalanır; özel bir üretim imzası değildir. Google Play yayını veya güvenli dağıtım için özel imzalama anahtarı kullanılmalıdır. İmza değişirse mevcut uygulamanın üzerine kurulum mümkün olmayabilir; kayıtları korumak için uygulamayı kaldırmadan önce raporlarınızı dışa aktarın.

Artifacts dosyaları 90 gün saklanır. `v1.0.1` gibi bir Git etiketi gönderildiğinde APK ayrıca GitHub **Releases** bölümüne eklenir. Başarısız işlemde kırmızı adımın hata kaydını kontrol edin; Gradle derleme hatalarında `android-build-error` artifact dosyası da oluşturulur.

## OnSpace veya EAS üzerinden APK

Alternatif olarak OnSpace sağ üst **Download → Android APK** seçeneğini kullanın.

Kaynak kodu dışa aktarıp Expo EAS kullanmak için bağımlılıklar kurulduktan sonra:

```sh
npx eas-cli login
npx eas-cli build:configure
npx eas-cli build --platform android --profile preview
```

EAS hesabı, proje bağlantısı, Android imzalama ve derleme için internet gerekir. `preview` profili APK, `production` profili mağaza için AAB üretir. Mevcut OnSpace proje kimliği varsa korunur.

## Cihaz kontrol listesi

1. APK'yı kurun, uçak modunu açın ve uygulamayı başlatın.
2. Görev, istizan ve not ekleyip uygulamayı tamamen kapatın; yeniden açınca kayıtları kontrol edin.
3. Yatan 1000, iade 100 ve malzeme 250 eklediğinizde net bakiyenin 850 olduğunu kontrol edin.
4. Görev tamamlayın, kayıt düzenleyin, silme onayını deneyin ve filtreleri kontrol edin.
5. Uçak modunda PDF ve Excel raporlarını oluşturup cihazdaki paylaşım/kaydetme seçeneğini kontrol edin.
6. Küçük ekran ve yatay yönlendirmede giriş alanlarının ve klavyenin erişilebilirliğini kontrol edin.

## Mimari

`services/` veri ve rapor işlemleri, `contexts/` ortak kayıt durumu, `hooks/` iş mantığı, `components/` arayüz ve `app/` Expo Router sayfalarıdır.
